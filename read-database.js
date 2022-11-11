const mysql = require("mysql");
const fs = require("fs");
const util = require("util");
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

  const query = util.promisify(con.query).bind(con);

  if (!inputFileName) {
    console.error(
      "Specify input file name:\nnode read-database.js myfile.json"
    );
    exit();
  }

  const data = loadDataFromFile(inputFileName);

  await query(`DROP TABLE IF EXISTS stations;`);
  await query(`DROP TABLE IF EXISTS station_lines;`);
  await query(`DROP TABLE IF EXISTS station_to_line;`);

  await query(
    `
      CREATE TABLE stations (
        ID CHAR(11) NOT NULL UNIQUE,
        Name VARCHAR(255) NOT NULL
      );
    `
  );
  
  await query(
    `
      CREATE TABLE station_lines (
        ID int NOT NULL UNIQUE,
        Name VARCHAR(255) NOT NULL
      );
  `
  );

  await query(
    `
      CREATE TABLE station_to_line (
        StationId CHAR(11) NOT NULL,
        LineId int NOT NULL,
        FOREIGN KEY (StationId) REFERENCES stations(ID),
        FOREIGN KEY (LineId) REFERENCES station_lines(ID)
      );
    `
  );

  con.end();
}

main();
