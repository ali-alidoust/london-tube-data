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

  await query(`DROP TABLE IF EXISTS station_to_line;`);
  await query(`DROP TABLE IF EXISTS stations;`);
  await query(`DROP TABLE IF EXISTS station_lines;`);

  await query(
    `
      CREATE TABLE stations (
        ID CHAR(12) NOT NULL UNIQUE,
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
        StationId CHAR(12) NOT NULL,
        LineId int NOT NULL,
        FOREIGN KEY (StationId) REFERENCES stations(ID),
        FOREIGN KEY (LineId) REFERENCES station_lines(ID)
      );
    `
  );

  for (const station of data.stations) {
    await query(
      `INSERT INTO stations (ID, Name) VALUES ("${station.id}","${station.name}");`
    );
  }

  let lineId = 0;
  for (const line of data.lines) {
    await query(
      `INSERT INTO station_lines (ID, Name) VALUES (${lineId}, "${line.name}");`
    );

    for (const stationId of line.stations) {
      await query(
        `INSERT INTO station_to_line (StationId, LineId) VALUES ("${stationId}", ${lineId});`
      );
    }

    lineId++;
  }

  con.end();
}

main();
