# Data Analytics Program — Diagnostic Placement Test

An interactive, self-contained, single-page diagnostic assessment used to evaluate
incoming students (ages 10–20) before starting the Data Analytics training program
(Excel → SQL → Python → Power BI). The test measures baseline numeracy/logic,
digital literacy, and actual working knowledge of each tool in the stack, plus a
self-reported confidence rating, so the instructor can decide **where each student
(and the cohort as a whole) should start**.

## 🎯 Purpose
- Diagnose current skill level of each student before Day 1.
- Compare **self-rated confidence** vs **actual demonstrated skill** per stack.
- Generate an automatic, evidence-based **recommended starting point** per student
  (Excel / SQL / Python / Power BI) and flag foundational gaps.
- Produce a clean, printable report (Save as PDF) that students send back to the
  professor for review — no server, no backend, everything runs in the browser.

## ✅ Completed Features
- **60-question diagnostic bank** (single correct answer each, verified), grouped
  into 7 sections:
  1. Foundational Math & Logic (10)
  2. Digital & Data Literacy (5)
  3. Microsoft Excel (10)
  4. SQL / Databases (10)
  5. Python Programming (10)
  6. Power BI & Data Visualization (10)
  7. Statistics & Data Interpretation (5)
- **Self-assessment (ungraded)** confidence sliders for Excel, SQL, Python, Power BI,
  and Math/Statistics — captured before the timer starts.
- **Student info capture**: name, age, email, country/location, grade/school level.
- **Strict 60-minute countdown timer** starting only when the student clicks
  "Begin Timed Test." Visual warnings at 5 minutes and 1 minute remaining.
  Auto-submits the test the instant time runs out.
- **No answer leakage during the test** — students only see whether an answer is
  right/wrong, and their score, **after** they submit the whole test.
- **Section-by-section navigation** with a question-jump grid, answered/unanswered
  indicators, and a pre-submit review screen showing unanswered questions per section.
- **Automatic scoring** — overall score, per-section score & percentage.
- **Charts** (Chart.js): score by section, and self-rated confidence vs. actual
  score for the 4 core tools.
- **Full answer review** after submission: every question, the student's answer,
  the correct answer, and a ✅/❌ indicator (with short explanations).
- **Per-tool skill tiers (NEW)**: Excel, SQL, Python and Power BI are each judged
  **independently** on a 4-tier scale — Mastery (≥85%), Proficient (65–84%),
  Developing (40–64%), Beginner (<40%) — with a plain-English action for each
  tier (e.g. "skip fundamentals," "fast-track refresher," "full module"). A high
  score in one tool never implies anything about another tool.
- **Suggested cohort starting focus**: in addition to the per-tool tiers, the
  engine still surfaces one suggested *primary teaching focus* — the first tool
  (in Excel → SQL → Python → Power BI order) that is below the 65% proficiency
  bar — plus a note on foundational math/digital-literacy gaps and age-based
  pacing. This is explicitly framed as a cohort-pacing suggestion, **not** a
  verdict that earlier tools are "fully mastered" or should be skipped outright
  — use the per-tool tier table for the full nuanced picture per student.
- **Automatic results collection (NEW)**: on submission, results are POSTed to
  a `diagnostic_results` table via the built-in RESTful Table API (in addition
  to the student's own PDF export) — see "Instructor Dashboard" below.
- **Instructor Dashboard (`admin.html`, NEW)**: a separate page that reads all
  submissions from the `diagnostic_results` table and shows cohort-wide stats,
  charts (average score by tool, tier distribution), a sortable/searchable
  table of every student, and a **CSV export** button.
- **Local autosave** (browser `localStorage`) — if the page is accidentally
  refreshed/closed, the student's progress and remaining time are restored.
- **Print / Save as PDF button** with dedicated print stylesheet (hides timer/nav
  controls, formats the report cleanly for sharing with the professor).
- Fully responsive, mobile/tablet-friendly layout (Tailwind CSS).

## 🌐 Entry Points
- `index.html` — the diagnostic test itself (no query parameters needed).
  - Screen flow: **Welcome → Student Info & Self-Assessment (untimed) → Timed
    Test (7 sections) → Review & Submit → Results & Printable Report**.
  - On submit, results are saved both (a) to the student's own printable
    report/PDF, and (b) automatically to the `diagnostic_results` table via
    the Table API — **only when the site is published/live** (see "Running
    Locally" below).
- `admin.html` — **instructor-only dashboard**. Shows every submission with
  cohort averages, tool-average and tier-distribution charts, a
  sortable/searchable table, and a "Export CSV" button. This page is not
  linked from the student-facing test; share it only with instructors, e.g.
  `https://your-published-site.com/admin.html`.

## 🖥️ Running Locally vs. Published
- The **test itself** (`index.html`) is plain HTML/CSS/JS and will run fine if
  you download the project folder and open `index.html` directly in a
  browser, or host it on any static web server.
- The **automatic results collection** (saving to `diagnostic_results` and
  viewing them in `admin.html`) depends on this platform's built-in RESTful
  Table API, which is only reachable once the site is **published** via the
  Publish tab (calls like `fetch('tables/diagnostic_results')` are relative
  and resolve against the live, published domain). If a student opens a
  locally downloaded copy of `index.html` (or you self-host it elsewhere
  without this backend), the auto-submit step will fail silently and they
  should fall back to **Print / Save as PDF** and email/share it with you —
  the page shows a clear on-screen message in either case ("✅ sent
  automatically" or "⚠️ please export as PDF instead").
- **Bottom line:** for centralized, automatic score collection, make sure
  students use the **published/live link** from the Publish tab — not a
  locally downloaded file.

## 🗂️ Data Model (client-side only, no external DB)
All state lives in browser memory + `localStorage` under the key
`dap_diagnostic_v1`:
```js
{
  studentInfo: { name, age, email, location, grade },
  selfAssessment: { excel, sql, python, powerbi, stats }, // 0–4 each
  answers: { q1: 2, q2: 0, ... },                          // selected option index
  endTime: 1730000000000,                                  // ms epoch, timer end
  screen: "test" | "review" | "results",
  currentSectionIndex: 0
}
```
In addition, on submission each result is also POSTed to a server-side table
(via the platform's RESTful Table API) so the instructor can view all
submissions in one place instead of collecting individual PDFs:

**Table: `diagnostic_results`**
| Field | Type | Notes |
|---|---|---|
| student_name, student_age, student_email, student_location, student_grade | text/number | From the info screen |
| total_correct, overall_pct | number | Overall score out of 60, and as % |
| foundation_pct, digital_pct, excel_pct, sql_pct, python_pct, powerbi_pct, stats_pct | number | Per-section % scores |
| excel_tier, sql_tier, python_tier, powerbi_tier | text | Mastery / Proficient / Developing / Beginner |
| self_excel, self_sql, self_python, self_powerbi, self_stats | number | Self-rated confidence (0–4) |
| answers_json | rich_text | Raw JSON of every answer given, for auditing |
| submitted_at | datetime | Submission timestamp |

This table is read by `admin.html` to power the instructor dashboard (stats,
charts, sortable table, CSV export). See "Running Locally vs. Published"
above for the one important caveat: this auto-collection only works on the
**published** site.

## 🚫 Not Yet Implemented
- Authentication/access control on `admin.html` — anyone with the URL can view
  it. Since it's not linked from the student-facing pages, treat the link as
  "unlisted," or ask and we can add a simple client-side passcode gate.
- Question randomization / anti-cheating measures (e.g., shuffled answer order,
  tab-switch detection) — not included since this is a low-stakes diagnostic.
- Multi-language support (currently English only).
- Adaptive difficulty (test is fixed-form, not computer-adaptive).
- De-duplication of repeat submissions (e.g. if a student submits twice, both
  rows will appear in `admin.html` — sort by "Submitted" and use the most
  recent one, or ask and we can add de-dupe-by-email logic).

## 🔭 Recommended Next Steps
1. Pilot the test with a handful of students first to confirm the 60-minute
   window and difficulty curve feel right for the age range.
2. If you want centralized, automatic score collection instead of manual PDF
   sharing, we can wire this to the built-in RESTful Table API (e.g., a
   `diagnostic_results` table) — just say the word and it can be added without
   changing the student-facing experience.
3. After the first cohort, review common wrong answers per section to refine
   which questions are mis-calibrated (too easy/too hard) for this age range.
4. Consider adding a short open-ended "what do you want to build with data?"
   motivational question — great for cohort grouping, not for scoring.

## 🧪 How to Use (for the professor)
1. Publish the site (Publish tab) and share the **published link** with all
   students before Monday's session (do not distribute a locally-downloaded
   copy if you want automatic collection to work).
2. Ask them to complete it in one sitting (60 minutes, timed automatically).
3. On submission, results are sent to you automatically — but also ask each
   student to click **"Print / Save as PDF"** as a backup and keep their PDF,
   in case of any connectivity issues.
4. Open `your-published-site.com/admin.html` yourself (not shared with
   students) to see **every submission in one dashboard**: cohort averages,
   tool-average and tier-distribution charts, a sortable/searchable table, and
   a one-click **CSV export** for deeper analysis in Excel/Power BI (fittingly!).
5. Use each student's **Per-Tool Skill Tier** section (Mastery / Proficient /
   Developing / Beginner per tool) plus the **Suggested Cohort Starting Focus**
   to place students and decide the cohort's starting stack. Remember: a high
   score in one tool does not imply mastery of another — check all four tiers.

## 🛠️ Tech Stack
- HTML5 + Tailwind CSS (CDN) for layout/styling.
- Vanilla JavaScript (no framework) for logic, timer, scoring, recommendation engine.
- Chart.js (CDN) for score visualizations.
- Font Awesome (CDN) for icons.
- No backend, no external API calls, no authentication — fully static & offline-capable
  once loaded (except CDN assets).
