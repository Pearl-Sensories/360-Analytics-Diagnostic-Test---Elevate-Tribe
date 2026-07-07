/* ==========================================================================
   Data Analytics Program — Diagnostic Test
   Application Logic: state machine, timer, scoring, recommendation engine
   ========================================================================== */

const TEST_DURATION_SECONDS = 60 * 60; // 60 minutes
const PASS_THRESHOLD = 0.65; // 65% competency threshold used by recommendation engine
const STORAGE_KEY = "dap_diagnostic_v1";

const state = {
  screen: "welcome", // welcome -> info -> test -> review -> results
  studentInfo: { name: "", age: "", email: "", location: "", grade: "" },
  selfAssessment: { excel: 2, sql: 2, python: 2, powerbi: 2, stats: 2 },
  answers: {},          // { [questionId]: selectedOptionIndex }
  currentSectionIndex: 0,
  endTime: null,        // epoch ms when timer ends
  timerInterval: null,
  submitted: false
};

// ---------------------------------------------------------------- Persistence
function saveState() {
  const toSave = {
    screen: state.screen,
    studentInfo: state.studentInfo,
    selfAssessment: state.selfAssessment,
    answers: state.answers,
    currentSectionIndex: state.currentSectionIndex,
    endTime: state.endTime,
    submitted: state.submitted
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); } catch (e) { /* ignore quota errors */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
    return true;
  } catch (e) { return false; }
}

function clearState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// ---------------------------------------------------------------- Utilities
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function questionsFor(sectionKey) {
  return QUESTIONS.filter(q => q.section === sectionKey);
}
function sectionByKey(key) {
  return SECTIONS.find(s => s.key === key);
}

// ---------------------------------------------------------------- Screen switching
function showScreen(name) {
  state.screen = name;
  $$(".app-screen").forEach(s => s.classList.add("hidden"));
  const target = document.getElementById(`screen-${name}`);
  if (target) target.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  saveState();
}

// ---------------------------------------------------------------- Welcome / Info screen
function initWelcomeScreen() {
  $("#btn-start-info").addEventListener("click", () => showScreen("info"));
}

function initInfoScreen() {
  const form = $("#student-info-form");
  ["name", "age", "email", "location", "grade"].forEach(field => {
    const input = $(`#field-${field}`);
    if (state.studentInfo[field]) input.value = state.studentInfo[field];
  });

  ["excel", "sql", "python", "powerbi", "stats"].forEach(tool => {
    const slider = $(`#self-${tool}`);
    slider.value = state.selfAssessment[tool];
    updateSelfLabel(tool, slider.value);
    slider.addEventListener("input", (e) => {
      state.selfAssessment[tool] = Number(e.target.value);
      updateSelfLabel(tool, e.target.value);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    state.studentInfo = {
      name: $("#field-name").value.trim(),
      age: $("#field-age").value.trim(),
      email: $("#field-email").value.trim(),
      location: $("#field-location").value.trim(),
      grade: $("#field-grade").value.trim()
    };
    if (!state.studentInfo.name || !state.studentInfo.age) {
      alert("Please enter at least your name and age before continuing.");
      return;
    }
    startTest();
  });
}

const SELF_LABELS = ["Never used it", "Beginner (seen it once/twice)", "Some exposure", "Comfortable", "Confident / Advanced"];
function updateSelfLabel(tool, val) {
  $(`#self-${tool}-label`).textContent = SELF_LABELS[Number(val)];
}

// ---------------------------------------------------------------- Test screen
function startTest() {
  if (!state.endTime) {
    state.endTime = Date.now() + TEST_DURATION_SECONDS * 1000;
  }
  state.currentSectionIndex = 0;
  buildTestScreen();
  showScreen("test");
  $("#timer-box").classList.remove("hidden");
  startTimer();
}

function buildTestScreen() {
  const container = $("#sections-container");
  container.innerHTML = "";

  SECTIONS.forEach((section, idx) => {
    const qs = questionsFor(section.key);
    const wrap = el("section", "test-section" + (idx === 0 ? "" : " hidden"));
    wrap.id = `section-${section.key}`;

    const header = el("div", "section-header");
    header.innerHTML = `
      <div class="section-header-icon" style="background:${section.color}22;color:${section.color}">
        <i class="fa-solid ${section.icon}"></i>
      </div>
      <div>
        <h2 class="section-title">${section.title}</h2>
        <p class="section-blurb">${section.blurb}</p>
      </div>`;
    wrap.appendChild(header);

    qs.forEach((q, qi) => {
      wrap.appendChild(buildQuestionCard(q, qi));
    });

    const nav = el("div", "section-nav-buttons");
    const prevBtn = el("button", "btn btn-secondary", '<i class="fa-solid fa-arrow-left mr-2"></i>Previous Section');
    prevBtn.type = "button";
    prevBtn.disabled = idx === 0;
    prevBtn.addEventListener("click", () => goToSection(idx - 1));

    const nextBtn = el("button", "btn btn-primary",
      idx === SECTIONS.length - 1 ? 'Review & Submit<i class="fa-solid fa-arrow-right ml-2"></i>' : 'Next Section<i class="fa-solid fa-arrow-right ml-2"></i>');
    nextBtn.type = "button";
    nextBtn.addEventListener("click", () => {
      if (idx === SECTIONS.length - 1) { buildReviewScreen(); showScreen("review"); }
      else goToSection(idx + 1);
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    wrap.appendChild(nav);
    container.appendChild(wrap);
  });

  buildQuestionJumpGrid();
  updateProgressBar();
}

function buildQuestionCard(q, index) {
  const card = el("div", "question-card");
  card.id = `qcard-${q.id}`;
  card.innerHTML = `<p class="question-text"><span class="q-number">Q${q.id}.</span> ${q.text.replace(/\n/g, "<br>")}</p>`;
  const optsWrap = el("div", "options-wrap");

  q.options.forEach((optText, oi) => {
    const optId = `q${q.id}-opt${oi}`;
    const label = el("label", "option-label");
    label.setAttribute("for", optId);
    label.innerHTML = `
      <input type="radio" name="q${q.id}" id="${optId}" value="${oi}" class="option-input">
      <span class="option-marker"></span>
      <span class="option-text">${optText}</span>`;
    optsWrap.appendChild(label);

    label.querySelector("input").addEventListener("change", () => {
      state.answers[q.id] = oi;
      card.classList.add("answered");
      refreshQuestionJumpItem(q.id);
      updateProgressBar();
      saveState();
    });
  });

  card.appendChild(optsWrap);

  // Restore prior answer if present
  if (state.answers[q.id] !== undefined) {
    const input = card.querySelector(`input[value="${state.answers[q.id]}"]`);
    if (input) { input.checked = true; card.classList.add("answered"); }
  }

  return card;
}

function goToSection(idx) {
  if (idx < 0 || idx >= SECTIONS.length) return;
  state.currentSectionIndex = idx;
  $$(".test-section").forEach((s, i) => s.classList.toggle("hidden", i !== idx));
  $$(".jump-section-group").forEach((g, i) => g.classList.toggle("jump-section-active", i === idx));
  window.scrollTo({ top: 0, behavior: "smooth" });
  saveState();
}

function buildQuestionJumpGrid() {
  const grid = $("#question-jump-grid");
  grid.innerHTML = "";
  SECTIONS.forEach((section, sIdx) => {
    const group = el("div", "jump-section-group" + (sIdx === 0 ? " jump-section-active" : ""));
    group.appendChild(el("p", "jump-section-label", section.title));
    const btnsWrap = el("div", "jump-buttons");
    questionsFor(section.key).forEach(q => {
      const btn = el("button", "jump-btn", q.id);
      btn.type = "button";
      btn.id = `jumpbtn-${q.id}`;
      btn.addEventListener("click", () => {
        goToSection(sIdx);
        setTimeout(() => {
          const card = $(`#qcard-${q.id}`);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      });
      btnsWrap.appendChild(btn);
    });
    group.appendChild(btnsWrap);
    grid.appendChild(group);
  });
  QUESTIONS.forEach(q => refreshQuestionJumpItem(q.id));
}

function refreshQuestionJumpItem(qid) {
  const btn = $(`#jumpbtn-${qid}`);
  if (btn) btn.classList.toggle("jump-answered", state.answers[qid] !== undefined);
}

function updateProgressBar() {
  const answered = Object.keys(state.answers).length;
  const total = QUESTIONS.length;
  const pct = Math.round((answered / total) * 100);
  $("#progress-bar-fill").style.width = `${pct}%`;
  $("#progress-text").textContent = `${answered} / ${total} answered`;
}

// ---------------------------------------------------------------- Timer
function startTimer() {
  updateTimerDisplay();
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    const remaining = Math.floor((state.endTime - Date.now()) / 1000);
    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      updateTimerDisplay(0);
      autoSubmit();
      return;
    }
    updateTimerDisplay(remaining);
  }, 1000);
}

function updateTimerDisplay(remainingOverride) {
  const remaining = remainingOverride !== undefined ? remainingOverride : Math.floor((state.endTime - Date.now()) / 1000);
  const display = $("#timer-display");
  display.textContent = formatTime(remaining);
  const timerBox = $("#timer-box");
  timerBox.classList.remove("timer-warning", "timer-critical");
  if (remaining <= 60) timerBox.classList.add("timer-critical");
  else if (remaining <= 300) timerBox.classList.add("timer-warning");
}

function autoSubmit() {
  alert("Time is up! Your test is being submitted automatically.");
  submitTest();
}

// ---------------------------------------------------------------- Review screen
function buildReviewScreen() {
  if (state.timerInterval) { /* keep timer running during review */ }
  const summary = $("#review-summary");
  summary.innerHTML = "";
  let totalAnswered = 0;

  SECTIONS.forEach(section => {
    const qs = questionsFor(section.key);
    const answeredInSection = qs.filter(q => state.answers[q.id] !== undefined).length;
    totalAnswered += answeredInSection;
    const row = el("div", "review-row");
    row.innerHTML = `
      <div class="review-row-icon" style="background:${section.color}22;color:${section.color}"><i class="fa-solid ${section.icon}"></i></div>
      <div class="flex-1">
        <p class="font-semibold">${section.title}</p>
        <p class="text-sm text-slate-500">${answeredInSection} / ${qs.length} answered</p>
      </div>
      ${answeredInSection < qs.length ? '<span class="badge badge-warning">Incomplete</span>' : '<span class="badge badge-success">Complete</span>'}
    `;
    const goBtn = el("button", "btn btn-small btn-secondary", "Go to section");
    goBtn.type = "button";
    goBtn.addEventListener("click", () => {
      showScreen("test");
      goToSection(SECTIONS.indexOf(section));
    });
    row.appendChild(goBtn);
    summary.appendChild(row);
  });

  $("#review-total-answered").textContent = `${totalAnswered} / ${QUESTIONS.length}`;
  const warnBox = $("#review-warning");
  if (totalAnswered < QUESTIONS.length) {
    warnBox.classList.remove("hidden");
    warnBox.textContent = `You still have ${QUESTIONS.length - totalAnswered} unanswered question(s). Unanswered questions are marked incorrect. You can go back, or submit now.`;
  } else {
    warnBox.classList.add("hidden");
  }
}

// ---------------------------------------------------------------- Scoring & Recommendation
function computeResults() {
  const bySection = {};
  SECTIONS.forEach(s => { bySection[s.key] = { correct: 0, total: 0 }; });

  let totalCorrect = 0;
  QUESTIONS.forEach(q => {
    bySection[q.section].total++;
    const given = state.answers[q.id];
    if (given !== undefined && given === q.correct) {
      bySection[q.section].correct++;
      totalCorrect++;
    }
  });

  const sectionResults = SECTIONS.map(s => {
    const { correct, total } = bySection[s.key];
    return { key: s.key, title: s.title, correct, total, pct: total ? correct / total : 0 };
  });

  return {
    totalCorrect,
    totalQuestions: QUESTIONS.length,
    overallPct: totalCorrect / QUESTIONS.length,
    sectionResults
  };
}

function pctOf(key, results) {
  const r = results.sectionResults.find(s => s.key === key);
  return r ? r.pct : 0;
}

/* ---------------------------------------------------------------- Tier thresholds
   Applied independently to EACH tool, instead of one blunt "start here, skip
   everything before it" cutoff. A high score on 10 fundamentals questions
   means "doesn't need remedial basics" — NOT "has nothing left to learn."
   ------------------------------------------------------------------------- */
const TIERS = [
  { min: 0.85, label: "Mastery",        cls: "badge-success", action: "Skip core fundamentals — move straight to intermediate/advanced material or a fast-track refresher only." },
  { min: 0.65, label: "Proficient",     cls: "badge-success", action: "Solid grasp of basics — a condensed refresher/fast-track module is enough before moving on." },
  { min: 0.40, label: "Developing",     cls: "badge-warning", action: "Some exposure but real gaps remain — teach the standard full module." },
  { min: 0,    label: "Beginner",       cls: "badge-danger",  action: "Little to no working knowledge yet — teach the full module from the ground up, with extra guided practice." }
];

function tierFor(pct) {
  return TIERS.find(t => pct >= t.min) || TIERS[TIERS.length - 1];
}

function buildRecommendation(results) {
  const foundationPct = pctOf("foundation", results);
  const digitalPct = pctOf("digital", results);
  const statsPct = pctOf("stats", results);

  const toolKeys = ["excel", "sql", "python", "powerbi"];
  const toolLabels = { excel: "Excel", sql: "SQL", python: "Python", powerbi: "Power BI" };

  // Per-tool tier — this is the core of the new engine. Every tool is judged
  // independently; a strong score in one tool never implies anything about another.
  const toolTiers = toolKeys.map(key => {
    const pct = pctOf(key, results);
    const tier = tierFor(pct);
    return { key, label: toolLabels[key], pct, tier: tier.label, cls: tier.cls, action: tier.action };
  });

  const notes = [];

  const foundationWeak = foundationPct < 0.5 || digitalPct < 0.5;
  if (foundationWeak) {
    notes.push("⚠️ Foundational math/logic or digital literacy scores are below 50%. Recommend a short refresher/bridge module on basic arithmetic, percentages, and computer/file literacy before diving into any tool — regardless of how strong any single tool score looks below.");
  }

  // Cohort-entry-point suggestion: first tool (in teaching order) that is NOT
  // at least "Proficient" (>=65%). This is a SUGGESTED PRIMARY FOCUS for cohort
  // pacing — not a verdict that earlier tools are "fully mastered" or should be
  // skipped outright. See the per-tool tier table for the full nuanced picture.
  const order = ["excel", "sql", "python", "powerbi"];
  let startingPoint = "Advanced / Capstone";
  let rationale = "";
  for (const key of order) {
    const t = toolTiers.find(tt => tt.key === key);
    if (t.pct < PASS_THRESHOLD) {
      startingPoint = toolLabels[key];
      rationale = `${toolLabels[key]} is the first tool (in Excel → SQL → Python → Power BI order) below the ${(PASS_THRESHOLD*100).toFixed(0)}% proficiency bar, scoring ${(t.pct*100).toFixed(0)}%. Use this as the cohort's primary teaching focus. This does NOT mean earlier tools are "done" — check each tool's tier below: only a "Mastery" tier (≥85%) justifies skipping fundamentals in that tool.`;
      break;
    }
  }
  if (rationale === "") {
    rationale = `The student is at or above the ${(PASS_THRESHOLD*100).toFixed(0)}% proficiency bar in Excel, SQL, Python and Power BI. Recommend an advanced/capstone track, using the per-tool tiers below to decide which single tool (if any) still deserves a light refresher.`;
  }

  if (statsPct < 0.5) {
    notes.push("📊 Statistics & data-interpretation score is under 50% — weave in extra practice reading charts, averages, and simple interpretation exercises throughout every module, regardless of the tool being taught.");
  }

  const age = Number(state.studentInfo.age);
  if (age && age <= 13) {
    notes.push("🧒 Given the student's age (≤13), consider a more visual, gamified pacing with shorter sessions and more guided practice, even where a tool shows a Mastery/Proficient tier.");
  } else if (age && age >= 18) {
    notes.push("🎓 Given the student's age (18+), a faster-paced, project-driven approach is likely appropriate where tiers support it.");
  }

  return { startingPoint, rationale, notes, toolTiers };
}

// ---------------------------------------------------------------- Submit & Results
function submitTest() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.submitted = true;
  const results = computeResults();
  const recommendation = buildRecommendation(results);
  renderResults(results, recommendation);
  showScreen("results");
  $("#timer-box").classList.add("hidden");
  saveState();
  submitResultsToApi(results, recommendation);
}

// ---------------------------------------------------------------- API submission
// Sends the final results to the `diagnostic_results` table via the RESTful
// Table API so the instructor can see ALL student submissions in one place
// (see admin.html). This only works once the site is PUBLISHED/live — if the
// page is opened locally (file://) or self-hosted elsewhere without this
// platform's backend, the request will fail silently and the student simply
// falls back to the "Print / Save as PDF" method.
async function submitResultsToApi(results, recommendation) {
  const statusEl = $("#api-submit-status");
  const tierByKey = {};
  recommendation.toolTiers.forEach(t => { tierByKey[t.key] = t.tier; });

  const payload = {
    student_name: state.studentInfo.name || "",
    student_age: Number(state.studentInfo.age) || 0,
    student_email: state.studentInfo.email || "",
    student_location: state.studentInfo.location || "",
    student_grade: state.studentInfo.grade || "",
    total_correct: results.totalCorrect,
    overall_pct: Math.round(results.overallPct * 1000) / 10,
    foundation_pct: Math.round(pctOf("foundation", results) * 1000) / 10,
    digital_pct: Math.round(pctOf("digital", results) * 1000) / 10,
    excel_pct: Math.round(pctOf("excel", results) * 1000) / 10,
    sql_pct: Math.round(pctOf("sql", results) * 1000) / 10,
    python_pct: Math.round(pctOf("python", results) * 1000) / 10,
    powerbi_pct: Math.round(pctOf("powerbi", results) * 1000) / 10,
    stats_pct: Math.round(pctOf("stats", results) * 1000) / 10,
    excel_tier: tierByKey.excel || "",
    sql_tier: tierByKey.sql || "",
    python_tier: tierByKey.python || "",
    powerbi_tier: tierByKey.powerbi || "",
    self_excel: state.selfAssessment.excel,
    self_sql: state.selfAssessment.sql,
    self_python: state.selfAssessment.python,
    self_powerbi: state.selfAssessment.powerbi,
    self_stats: state.selfAssessment.stats,
    answers_json: JSON.stringify(state.answers),
    submitted_at: Date.now()
  };

  try {
const response = await fetch("https://script.google.com/macros/s/AKfycbztS4U-rUJ-ctwOCEYV7WTbygN_9UcS8UTi828IaZgwqS5ZZHDE_FT5jt6LkUCXQyFZ/exec", {
    method: "POST",
   headers: {
    "Content-Type": "text/plain"
},
    body: JSON.stringify(payload)
});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (statusEl) {
      statusEl.textContent = "✅ Your results were sent to your instructor automatically.";
      statusEl.className = "api-status api-status-success";
      statusEl.classList.remove("hidden");
    }
    state.apiSubmitted = true;
    saveState();
  } catch (err) {
    console.warn("Could not submit results to API (this is expected if running locally/offline):", err);
    if (statusEl) {
      statusEl.textContent = "⚠️ Could not auto-send results (this happens if the page isn't published, or you're offline). Please use \"Print / Save as PDF\" below and share it with your instructor instead.";
      statusEl.className = "api-status api-status-warning";
      statusEl.classList.remove("hidden");
    }
  }
}

let scoreChartInstance = null;
let selfVsActualChartInstance = null;

function renderResults(results, recommendation) {
  $("#result-student-name").textContent = state.studentInfo.name || "—";
  $("#result-student-age").textContent = state.studentInfo.age || "—";
  $("#result-student-location").textContent = state.studentInfo.location || "—";
  $("#result-student-email").textContent = state.studentInfo.email || "—";
  $("#result-date").textContent = new Date().toLocaleString();

  $("#result-overall-score").textContent = `${results.totalCorrect} / ${results.totalQuestions}`;
  $("#result-overall-pct").textContent = `${(results.overallPct * 100).toFixed(1)}%`;

  const band = scoreBand(results.overallPct);
  const bandEl = $("#result-overall-band");
  bandEl.textContent = band.label;
  bandEl.className = `badge ${band.cls}`;

  // Section breakdown table
  const tbody = $("#result-section-table-body");
  tbody.innerHTML = "";
  results.sectionResults.forEach(r => {
    const sec = sectionByKey(r.key);
    const rowBand = scoreBand(r.pct);
    const tr = el("tr");
    tr.innerHTML = `
      <td class="py-2 pr-2"><i class="fa-solid ${sec.icon} mr-2" style="color:${sec.color}"></i>${sec.title.replace(/^\d+\.\s*/, "")}</td>
      <td class="py-2 pr-2 text-center">${r.correct} / ${r.total}</td>
      <td class="py-2 pr-2 text-center">${(r.pct * 100).toFixed(0)}%</td>
      <td class="py-2 text-center"><span class="badge ${rowBand.cls}">${rowBand.label}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Recommendation block
  $("#result-recommendation-start").textContent = recommendation.startingPoint;
  $("#result-recommendation-rationale").textContent = recommendation.rationale;
  const notesList = $("#result-recommendation-notes");
  notesList.innerHTML = "";
  recommendation.notes.forEach(n => {
    const li = el("li", null, n);
    notesList.appendChild(li);
  });
  $("#result-recommendation-notes-wrap").classList.toggle("hidden", recommendation.notes.length === 0);

  // Per-tool tier cards (Mastery / Proficient / Developing / Beginner per tool)
  const tierGrid = $("#tool-tier-grid");
  tierGrid.innerHTML = "";
  const toolIcons = { excel: "fa-file-excel", sql: "fa-database", python: "fa-code", powerbi: "fa-chart-pie" };
  const toolColors = { excel: "#16a34a", sql: "#f59e0b", python: "#3b82f6", powerbi: "#eab308" };
  recommendation.toolTiers.forEach(t => {
    const card = el("div", "tool-tier-card");
    card.innerHTML = `
      <div class="tool-tier-header">
        <i class="fa-solid ${toolIcons[t.key]}" style="color:${toolColors[t.key]}"></i>
        <span class="tool-tier-name">${t.label}</span>
        <span class="badge ${t.cls}">${t.tier}</span>
      </div>
      <p class="tool-tier-pct">${(t.pct * 100).toFixed(0)}% correct</p>
      <p class="tool-tier-action">${t.action}</p>
    `;
    tierGrid.appendChild(card);
  });

  // Charts
  renderScoreChart(results);
  renderSelfVsActualChart(results);

  // Detailed answer review
  renderAnswerReview();
}

function scoreBand(pct) {
  if (pct >= 0.85) return { label: "Advanced", cls: "badge-success" };
  if (pct >= 0.65) return { label: "Proficient", cls: "badge-success" };
  if (pct >= 0.4) return { label: "Developing", cls: "badge-warning" };
  return { label: "Beginner", cls: "badge-danger" };
}

function renderScoreChart(results) {
  const ctx = $("#chart-score-by-section").getContext("2d");
  if (scoreChartInstance) scoreChartInstance.destroy();
  scoreChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: results.sectionResults.map(r => sectionByKey(r.key).title.replace(/^\d+\.\s*/, "")),
      datasets: [{
        label: "Score (%)",
        data: results.sectionResults.map(r => Math.round(r.pct * 100)),
        backgroundColor: results.sectionResults.map(r => sectionByKey(r.key).color)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" } } },
      plugins: { legend: { display: false }, title: { display: true, text: "Score by Section" } }
    }
  });
}

function renderSelfVsActualChart(results) {
  const ctx = $("#chart-self-vs-actual").getContext("2d");
  if (selfVsActualChartInstance) selfVsActualChartInstance.destroy();
  const tools = [
    { key: "excel", label: "Excel" },
    { key: "sql", label: "SQL" },
    { key: "python", label: "Python" },
    { key: "powerbi", label: "Power BI" }
  ];
  selfVsActualChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: tools.map(t => t.label),
      datasets: [
        {
          label: "Self-rated confidence (%)",
          data: tools.map(t => (state.selfAssessment[t.key] / 4) * 100),
          backgroundColor: "rgba(99,102,241,0.2)",
          borderColor: "rgba(99,102,241,1)",
          pointBackgroundColor: "rgba(99,102,241,1)"
        },
        {
          label: "Actual score (%)",
          data: tools.map(t => Math.round(pctOf(t.key, results) * 100)),
          backgroundColor: "rgba(236,72,153,0.2)",
          borderColor: "rgba(236,72,153,1)",
          pointBackgroundColor: "rgba(236,72,153,1)"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 25 } } },
      plugins: { title: { display: true, text: "Self-Rated Confidence vs. Actual Score" } }
    }
  });
}

function renderAnswerReview() {
  const container = $("#answer-review-container");
  container.innerHTML = "";
  SECTIONS.forEach(section => {
    const qs = questionsFor(section.key);
    const secWrap = el("div", "answer-review-section");
    secWrap.innerHTML = `<h3 class="answer-review-section-title" style="color:${section.color}"><i class="fa-solid ${section.icon} mr-2"></i>${section.title}</h3>`;
    qs.forEach(q => {
      const given = state.answers[q.id];
      const isCorrect = given === q.correct;
      const wasAnswered = given !== undefined;
      const card = el("div", `answer-review-card ${isCorrect ? "answer-correct" : "answer-incorrect"}`);
      card.innerHTML = `
        <p class="font-medium mb-1"><span class="q-number">Q${q.id}.</span> ${q.text.replace(/\n/g, "<br>")}
          <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'} ml-2">${isCorrect ? "Correct" : (wasAnswered ? "Incorrect" : "Not answered")}</span>
        </p>
        <p class="text-sm"><strong>Your answer:</strong> ${wasAnswered ? escapeHtml(q.options[given]) : "<em>No answer given</em>"}</p>
        ${!isCorrect ? `<p class="text-sm"><strong>Correct answer:</strong> ${escapeHtml(q.options[q.correct])}</p>` : ""}
        <p class="text-sm text-slate-500 mt-1"><i class="fa-solid fa-circle-info mr-1"></i>${q.explanation}</p>
      `;
      secWrap.appendChild(card);
    });
    container.appendChild(secWrap);
  });
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ---------------------------------------------------------------- Init
function initApp() {
  const restored = loadState();

  initWelcomeScreen();
  initInfoScreen();

  $("#btn-review-back").addEventListener("click", () => showScreen("test"));
  $("#btn-final-submit").addEventListener("click", () => {
    if (confirm("Are you sure you want to submit your test? You will not be able to change your answers afterward.")) {
      submitTest();
    }
  });
  $("#btn-print").addEventListener("click", () => window.print());
  $("#btn-restart").addEventListener("click", () => {
    if (confirm("This will erase all current answers and start a brand new test. Continue?")) {
      clearState();
      window.location.reload();
    }
  });

  if (restored && state.studentInfo.name) {
    if (state.screen === "results" && state.submitted) {
      buildTestScreen(); // needed so answer review can reflect DOM-independent data; safe no-op for results
      const results = computeResults();
      const recommendation = buildRecommendation(results);
      renderResults(results, recommendation);
      showScreen("results");
      $("#timer-box").classList.add("hidden");
    } else if (state.endTime && Date.now() < state.endTime) {
      buildTestScreen();
      goToSection(state.currentSectionIndex || 0);
      showScreen(state.screen === "review" ? "review" : "test");
      if (state.screen === "review") buildReviewScreen();
      $("#timer-box").classList.remove("hidden");
      startTimer();
    } else if (state.endTime && Date.now() >= state.endTime) {
      buildTestScreen();
      submitTest();
    } else {
      showScreen("info");
      // re-init info screen values after DOM already bound above
      initInfoScreen();
    }
  } else {
    showScreen("welcome");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
