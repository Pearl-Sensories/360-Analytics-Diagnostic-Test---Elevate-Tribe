/* ==========================================================================
   Data Analytics Program — Diagnostic Test
   Question Bank + Answer Key
   --------------------------------------------------------------------------
   Every question has been manually verified for a single unambiguous
   correct answer (see README.md for the verification notes).
   `correct` is a 0-based index into `options`.
   ========================================================================== */

const SECTIONS = [
  {
    key: "foundation",
    title: "1. Foundational Math & Logic",
    icon: "fa-calculator",
    color: "#6366f1",
    blurb: "Basic arithmetic, fractions, percentages and logical reasoning — needed for every stage of analytics."
  },
  {
    key: "digital",
    title: "2. Digital & Data Literacy",
    icon: "fa-laptop-code",
    color: "#0ea5e9",
    blurb: "General comfort with computers, files and the vocabulary of data."
  },
  {
    key: "excel",
    title: "3. Microsoft Excel",
    icon: "fa-file-excel",
    color: "#16a34a",
    blurb: "Formulas, functions, references and charts in spreadsheets."
  },
  {
    key: "sql",
    title: "4. SQL & Databases",
    icon: "fa-database",
    color: "#f59e0b",
    blurb: "Querying, filtering, sorting and combining data stored in databases."
  },
  {
    key: "python",
    title: "5. Python Programming",
    icon: "fa-code",
    color: "#3b82f6",
    blurb: "Core syntax, data types, control flow and the pandas library."
  },
  {
    key: "powerbi",
    title: "6. Power BI & Data Visualization",
    icon: "fa-chart-pie",
    color: "#eab308",
    blurb: "Reports, dashboards, DAX, Power Query and choosing the right chart."
  },
  {
    key: "stats",
    title: "7. Statistics & Data Interpretation",
    icon: "fa-chart-line",
    color: "#ec4899",
    blurb: "Reading and interpreting summary statistics and simple charts."
  }
];

const QUESTIONS = [
  // ---------------------------------------------------------------- 1. FOUNDATION
  { id: 1, section: "foundation", text: "What is 15% of 200?",
    options: ["20", "30", "15", "45"], correct: 1,
    explanation: "15% of 200 = 0.15 × 200 = 30." },
  { id: 2, section: "foundation", text: "What is 3/4 + 1/8?",
    options: ["4/8", "7/8", "1", "5/8"], correct: 1,
    explanation: "3/4 = 6/8, so 6/8 + 1/8 = 7/8." },
  { id: 3, section: "foundation", text: "A car travels 60 km in 1.5 hours. What is its average speed?",
    options: ["30 km/h", "45 km/h", "40 km/h", "90 km/h"], correct: 2,
    explanation: "Speed = distance ÷ time = 60 ÷ 1.5 = 40 km/h." },
  { id: 4, section: "foundation", text: "Solve for x: 2x + 5 = 17",
    options: ["x = 5", "x = 6", "x = 11", "x = 12"], correct: 1,
    explanation: "2x = 17 − 5 = 12, so x = 6." },
  { id: 5, section: "foundation", text: "What is the median of this data set: 4, 8, 15, 16, 23, 42?",
    options: ["15", "16", "15.5", "19.67"], correct: 2,
    explanation: "With 6 values, the median is the average of the two middle values: (15+16)/2 = 15.5." },
  { id: 6, section: "foundation", text: "Which of these numbers is a prime number?",
    options: ["21", "33", "37", "51"], correct: 2,
    explanation: "21=3×7, 33=3×11, 51=3×17 are all divisible by other numbers. 37 has no divisors other than 1 and itself." },
  { id: 7, section: "foundation", text: "Using the correct order of operations, what is 10 − 2 × 3?",
    options: ["24", "4", "8", "-4"], correct: 1,
    explanation: "Multiplication happens first: 2×3=6, then 10−6=4." },
  { id: 8, section: "foundation", text: "What is the next number in this sequence: 2, 4, 8, 16, __?",
    options: ["18", "24", "30", "32"], correct: 3,
    explanation: "Each number doubles the previous one: 16 × 2 = 32." },
  { id: 9, section: "foundation", text: "A rectangle has a length of 12 cm and a width of 5 cm. What is its area?",
    options: ["17 cm²", "34 cm²", "60 cm²", "70 cm²"], correct: 2,
    explanation: "Area = length × width = 12 × 5 = 60 cm²." },
  { id: 10, section: "foundation", text: "Which of these values is the largest?",
    options: ["0.5", "3/8", "45%", "0.4"], correct: 0,
    explanation: "0.5 = 50%, which is larger than 3/8 (37.5%), 45%, and 0.4 (40%)." },

  // ---------------------------------------------------------------- 2. DIGITAL LITERACY
  { id: 11, section: "digital", text: "Which file extension is most commonly used for a modern Excel workbook?",
    options: [".docx", ".xlsx", ".pptx", ".pdf"], correct: 1,
    explanation: "Modern Excel workbooks are saved with the .xlsx extension." },
  { id: 12, section: "digital", text: "What does 'CSV' stand for?",
    options: ["Comma Separated Values", "Computer System Version", "Central Storage Vault", "Coded Sequential Values"], correct: 0,
    explanation: "CSV = Comma Separated Values, a plain-text data format." },
  { id: 13, section: "digital", text: "Which of the following is the best example of 'structured data'?",
    options: ["A table of sales figures organized in rows and columns", "A random photograph", "The text of a tweet", "An audio recording"], correct: 0,
    explanation: "Structured data fits neatly into rows and columns (like a spreadsheet or database table)." },
  { id: 14, section: "digital", text: "Which of these best defines a 'database'?",
    options: ["A single Excel worksheet", "An organized collection of data stored and accessed electronically", "A printed report", "A type of computer virus"], correct: 1,
    explanation: "A database is an organized, electronically stored collection of data." },
  { id: 15, section: "digital", text: "Which best describes 'Big Data'?",
    options: ["Any file larger than 1MB", "Data that is only used by big companies", "Extremely large and complex data sets that traditional tools struggle to process", "A type of database software"], correct: 2,
    explanation: "Big Data refers to data sets so large or complex that traditional data-processing tools are inadequate." },

  // ---------------------------------------------------------------- 3. EXCEL
  { id: 16, section: "excel", text: "Which function would you use to add up a range of cells, e.g. A1 to A10?",
    options: ["=TOTAL(A1:A10)", "=SUM(A1:A10)", "=ADD(A1:A10)", "=PLUS(A1:A10)"], correct: 1,
    explanation: "=SUM() is Excel's built-in addition function." },
  { id: 17, section: "excel", text: "Which symbol must you type first to begin any formula in Excel?",
    options: ["#", "@", "=", "$"], correct: 2,
    explanation: "All Excel formulas begin with an equals sign (=)." },
  { id: 18, section: "excel", text: "Which function calculates the average of a range of numbers?",
    options: ["=AVERAGE(range)", "=MEAN(range)", "=MID(range)", "=TOTAL(range)"], correct: 0,
    explanation: "=AVERAGE() returns the arithmetic mean of a range." },
  { id: 19, section: "excel", text: "What does the VLOOKUP function do?",
    options: ["Sorts a column alphabetically", "Searches for a value in the first column of a range and returns a value from another column in the same row", "Counts the number of rows in a table", "Deletes duplicate values"], correct: 1,
    explanation: "VLOOKUP performs a vertical lookup: it searches the leftmost column for a value and returns a related value from the same row." },
  { id: 20, section: "excel", text: "In the cell reference $A$1, what does the dollar sign ($) do?",
    options: ["Formats the cell as currency", "Makes the reference absolute so it doesn't change when the formula is copied", "Deletes the cell reference", "Converts the value to a percentage"], correct: 1,
    explanation: "Dollar signs create an absolute reference, locking the row and/or column when copied." },
  { id: 21, section: "excel", text: "Which function counts how many cells in a range contain numbers?",
    options: ["=COUNTA()", "=COUNT()", "=SUMIF()", "=TALLY()"], correct: 1,
    explanation: "=COUNT() counts cells containing numeric values only." },
  { id: 22, section: "excel", text: "Which formula correctly calculates 20% tax on the value in cell B2?",
    options: ["=B2*0.2", "=B2/0.2", "=B2+0.2", "=0.2/B2"], correct: 0,
    explanation: "Multiplying the value by 0.2 (20%) gives the tax amount." },
  { id: 23, section: "excel", text: "Which chart type is best suited for showing how a value changes over time?",
    options: ["Pie chart", "Line chart", "Scatter chart", "Doughnut chart"], correct: 1,
    explanation: "Line charts clearly show trends across a continuous time axis." },
  { id: 24, section: "excel", text: "What does the IF function do in Excel?",
    options: ["Always returns TRUE", "Tests a condition and returns one value if true and another if false", "Only works with text values", "Deletes cells that meet a condition"], correct: 1,
    explanation: "=IF(condition, value_if_true, value_if_false) is a conditional logic function." },
  { id: 25, section: "excel", text: "Which keyboard shortcut copies the selected cell(s) in Excel?",
    options: ["Ctrl+V", "Ctrl+X", "Ctrl+C", "Ctrl+Z"], correct: 2,
    explanation: "Ctrl+C copies; Ctrl+V pastes; Ctrl+X cuts; Ctrl+Z undoes." },

  // ---------------------------------------------------------------- 4. SQL
  { id: 26, section: "sql", text: "Which SQL keyword is used to retrieve data from a database?",
    options: ["GET", "SELECT", "FETCH", "SHOW"], correct: 1,
    explanation: "SELECT is used to query and retrieve data from tables." },
  { id: 27, section: "sql", text: "Which clause is used to filter rows based on a condition in SQL?",
    options: ["FILTER", "WHERE", "HAVING", "IF"], correct: 1,
    explanation: "WHERE filters individual rows before any grouping occurs." },
  { id: 28, section: "sql", text: "Which SQL statement is used to add new data into a table?",
    options: ["ADD INTO", "INSERT INTO", "CREATE INTO", "NEW ROW"], correct: 1,
    explanation: "INSERT INTO adds new rows of data to a table." },
  { id: 29, section: "sql", text: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Logic", "Sequential Query Language", "Structured Question Language"], correct: 0,
    explanation: "SQL = Structured Query Language." },
  { id: 30, section: "sql", text: "Which clause is used to sort the results of a SQL query?",
    options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE BY"], correct: 1,
    explanation: "ORDER BY sorts the result set by one or more columns." },
  { id: 31, section: "sql", text: "Which SQL function returns the number of rows in a result set?",
    options: ["SUM()", "TOTAL()", "COUNT()", "NUM()"], correct: 2,
    explanation: "COUNT() returns the number of rows matching a query." },
  { id: 32, section: "sql", text: "Which keyword removes duplicate rows from a SQL query's results?",
    options: ["UNIQUE", "DISTINCT", "REMOVE DUPLICATES", "NODUPES"], correct: 1,
    explanation: "SELECT DISTINCT removes duplicate rows from the output." },
  { id: 33, section: "sql", text: "What does the SQL clause GROUP BY do?",
    options: ["Deletes grouped rows", "Groups rows that share the same values into summary rows, often used with aggregate functions", "Sorts rows alphabetically", "Creates a new table"], correct: 1,
    explanation: "GROUP BY groups rows sharing a value so aggregate functions (SUM, COUNT, AVG...) can summarize each group." },
  { id: 34, section: "sql", text: "Which type of SQL JOIN returns only the rows that have matching values in BOTH tables?",
    options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"], correct: 2,
    explanation: "INNER JOIN returns only rows with matches in both joined tables." },
  { id: 35, section: "sql", text: "Which SQL statement is used to modify existing data in a table?",
    options: ["CHANGE", "UPDATE", "MODIFY", "ALTER"], correct: 1,
    explanation: "UPDATE changes existing values in a table (ALTER changes table structure, not data)." },

  // ---------------------------------------------------------------- 5. PYTHON
  { id: 36, section: "python", text: "Which symbol is used to write a comment in Python?",
    options: ["//", "#", "<!-- -->", "**"], correct: 1,
    explanation: "The # symbol starts a single-line comment in Python." },
  { id: 37, section: "python", text: "In Python, what data type is the value True?",
    options: ["String", "Integer", "Boolean", "Float"], correct: 2,
    explanation: "True and False are Boolean (bool) values in Python." },
  { id: 38, section: "python", text: "Which function is used to display output to the screen in Python?",
    options: ["show()", "print()", "display()", "echo()"], correct: 1,
    explanation: "print() outputs text/values to the console." },
  { id: 39, section: "python", text: 'What will len("Data") return in Python?',
    options: ["3", "4", "5", "Error"], correct: 1,
    explanation: '"Data" has 4 characters (D-a-t-a), so len() returns 4.' },
  { id: 40, section: "python", text: "Which of the following correctly creates a list in Python?",
    options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"], correct: 2,
    explanation: "Square brackets [ ] define a list. Parentheses create a tuple and curly braces create a set." },
  { id: 41, section: "python", text: "Which of these is the correct syntax for an if statement in Python?",
    options: ["if x > 5 then:", "if (x > 5) {", "if x > 5:", "if x > 5 do:"], correct: 2,
    explanation: "Python if statements end with a colon: if x > 5:" },
  { id: 42, section: "python", text: "Which Python library is most commonly used for data manipulation and analysis?",
    options: ["matplotlib", "pandas", "tkinter", "flask"], correct: 1,
    explanation: "pandas is the standard library for working with tabular data in Python (matplotlib is for plotting)." },
  { id: 43, section: "python", text: "What does this code print?\nx = 5\ny = 2\nprint(x % y)",
    options: ["2.5", "2", "1", "0"], correct: 2,
    explanation: "% is the modulo operator (remainder). 5 divided by 2 leaves a remainder of 1." },
  { id: 44, section: "python", text: "Which of the following is used to repeat a block of code multiple times in Python?",
    options: ["if statement", "for loop", "print statement", "import statement"], correct: 1,
    explanation: "Loops (for/while) repeat blocks of code." },
  { id: 45, section: "python", text: "Which line of code correctly creates a variable named score with the value 90?",
    options: ["score == 90", "90 = score", "score = 90", "var score = 90"], correct: 2,
    explanation: "A single = assigns a value to a variable in Python; == is used for comparison, and 'var' is not valid Python syntax." },

  // ---------------------------------------------------------------- 6. POWER BI
  { id: 46, section: "powerbi", text: "What is Power BI primarily used for?",
    options: ["Writing code for mobile apps", "Business intelligence, data analysis, and visualization", "Sending emails", "Managing social media accounts"], correct: 1,
    explanation: "Power BI is Microsoft's business intelligence and data visualization tool." },
  { id: 47, section: "powerbi", text: "Which formula language does Power BI use to create calculated columns and measures?",
    options: ["SQL", "DAX", "VBA", "Python"], correct: 1,
    explanation: "DAX (Data Analysis Expressions) is Power BI's formula language for measures and calculated columns." },
  { id: 48, section: "powerbi", text: "In Power BI, what is a 'Dashboard'?",
    options: ["A single-page collection of visuals used for at-a-glance monitoring, often pinned from reports", "A place to write DAX formulas", "A type of database", "A downloadable Excel file"], correct: 0,
    explanation: "A Dashboard is a single canvas of pinned visuals (often from one or more reports) for quick monitoring." },
  { id: 49, section: "powerbi", text: "Which Power BI feature lets you connect to, clean, and combine data from multiple sources?",
    options: ["Power Query", "Power Point", "Power Automate", "Power Map"], correct: 0,
    explanation: "Power Query is the data connection, cleaning, and transformation engine in Power BI." },
  { id: 50, section: "powerbi", text: "What is the main difference between a Report and a Dashboard in Power BI?",
    options: ["They are exactly the same thing", "A report can contain multiple pages of visuals, while a dashboard is typically a single page of pinned visuals", "A dashboard can only show text", "A report cannot be shared with others"], correct: 1,
    explanation: "Reports can span multiple pages with interactive visuals; dashboards are single-page summary views." },
  { id: 51, section: "powerbi", text: "Which Power BI component/editor is specifically used to clean and transform data before it is loaded into the model?",
    options: ["DAX Editor", "Power Query Editor", "Report View", "Data Alerts"], correct: 1,
    explanation: "The Power Query Editor is where data is cleaned and shaped before loading." },
  { id: 52, section: "powerbi", text: "In Power BI, what is a 'measure'?",
    options: ["A static value typed directly into a cell", "A calculation created using DAX that is computed dynamically based on context", "A type of chart", "A saved filter"], correct: 1,
    explanation: "Measures are dynamic DAX calculations evaluated based on the current filter/report context." },
  { id: 53, section: "powerbi", text: "Which visual would best show how parts contribute to a whole, such as market share by region?",
    options: ["Line chart", "Pie chart", "Scatter chart", "Table"], correct: 1,
    explanation: "Pie charts (or similar part-to-whole visuals) are designed to show proportions of a whole." },
  { id: 54, section: "powerbi", text: "In Power BI, what is the 'M language' used for?",
    options: ["Writing measures and calculated columns", "The formula language used within Power Query for data transformation steps", "Formatting visuals", "Creating relationships between tables"], correct: 1,
    explanation: "M is the functional language behind every Power Query transformation step (DAX is used for measures/columns)." },
  { id: 55, section: "powerbi", text: "Which of the following is a valid DAX aggregation function?",
    options: ["TOTAL()", "SUM()", "ADDUP()", "COMBINE()"], correct: 1,
    explanation: "SUM() is a built-in DAX aggregation function." },

  // ---------------------------------------------------------------- 7. STATISTICS
  { id: 56, section: "stats", text: "In statistics, what does the 'mean' of a data set refer to?",
    options: ["The most frequently occurring value", "The middle value when sorted", "The average of all values", "The difference between the highest and lowest values"], correct: 2,
    explanation: "The mean is the sum of all values divided by the count of values — the average." },
  { id: 57, section: "stats", text: "What is the mode of this data set: 2, 2, 3, 5, 9?",
    options: ["2", "3", "5", "4.2"], correct: 0,
    explanation: "The mode is the most frequently occurring value; 2 appears twice, more than any other value." },
  { id: 58, section: "stats", text: "A bar chart is best used for comparing which type of data?",
    options: ["Continuous change over time", "Distinct categories or groups", "Relationships between two numeric variables", "Parts of a single whole only"], correct: 1,
    explanation: "Bar charts compare discrete categories side by side." },
  { id: 59, section: "stats", text: "What is an 'outlier' in a data set?",
    options: ["The average of all the data", "The most common value in the data", "A value that is significantly different from the other observations", "The total number of data points"], correct: 2,
    explanation: "An outlier is a data point that differs markedly from the rest of the observations." },
  { id: 60, section: "stats", text: "What does 'correlation' measure?",
    options: ["The exact cause of an event", "The strength and direction of a relationship between two variables", "The total sum of a data set", "The number of missing values in a data set"], correct: 1,
    explanation: "Correlation measures how strongly (and in which direction) two variables move together — it does not imply causation." }
];

// Quick integrity check helper (used only in console during development)
function _validateQuestionBank() {
  const ids = QUESTIONS.map(q => q.id);
  const uniqueIds = new Set(ids);
  console.assert(ids.length === uniqueIds.size, "Duplicate question IDs found!");
  QUESTIONS.forEach(q => {
    console.assert(q.options.length === 4, `Q${q.id} does not have 4 options`);
    console.assert(q.correct >= 0 && q.correct < q.options.length, `Q${q.id} has invalid correct index`);
  });
  console.log(`Question bank validated: ${QUESTIONS.length} questions.`);
}
