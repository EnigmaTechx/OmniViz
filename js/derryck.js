const fs = require("fs");

// Input and output file paths
const inputFile = "../data/Ask_A_Manager_Salary Survey_2021 (Responses).csv";
const outputFile = "../data/output.csv";
console.log("working on parsing");
// Function to normalize country names
function normalizeCountry(country) {
  const usaVariants = ["US", "usa", "United States", "USA"];
  if (usaVariants.includes(country.trim())) {
    return "USA";
  }
  return country;
}

// Read input file, modify data, and write to output file
const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

let isFirstLine = true;

readStream.on("data", (chunk) => {
  const lines = chunk.toString().split("\n");
  lines.forEach((line, index) => {
    if (isFirstLine) {
      // Write the header line as it is
      writeStream.write(line + "\n");
      isFirstLine = false;
    } else {
      // Split the line into columns
      const columns = line.split(",");
      // Modify the column value if it's the 'What country do you work in?' column
      if (columns.length > 1) {
        const columnName = columns[0];
        const columnValue = columns[1].trim();
        if (columnName === "What country do you work in?") {
          columns[1] = normalizeCountry(columnValue);
        }
      }
      // Write the modified line to the output file
      writeStream.write(columns.join(",") + "\n");
    }
  });
});

readStream.on("end", () => {
  console.log("CSV file has been written with modified data.");
  writeStream.end();
});

readStream.on("error", (err) => {
  console.error("Error reading input file:", err);
});

writeStream.on("error", (err) => {
  console.error("Error writing output file:", err);
});
