const mysql = require("mysql");
const fs = require("fs");
const { exit } = require("process");

function loadDataFromFile(inputFileName) {
  const fileContent = fs.readFileSync(inputFileName);
  return JSON.parse(fileContent);
}

async function main() {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass12345", //TODO: Use .env file
    database: "london",
  });

  const inputFileName = process.argv[2];

  if (!inputFileName) {
    console.error(
      "Specify input file name:\nnode read-database.js myfile.json"
    );
    exit();
  }

  const data = loadDataFromFile(inputFileName);

  con.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
    if (error) throw error;
    console.log(results);
  });

  con.end();
}

main();
