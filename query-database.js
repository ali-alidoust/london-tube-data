const mysql = require("mysql");
const util = require("util");
const { exit } = require("process");

async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass12345", //TODO: Use .env file
    database: "london",
  });
}

async function getStations(lineId) {
  let con = null;
  try {
    con = await getConnection();
    const query = util.promisify(con.query).bind(con);

    // TODO: Validate input
    result = await query(`
        SELECT stations.Name FROM station_to_line
        INNER JOIN stations ON stations.ID = station_to_line.StationId
        WHERE station_to_line.LineId = ${lineId}
    `);

    return result.map((item) => item.Name);
  } catch (err) {
    throw err;
  } finally {
    if (con) {
      con.end();
    }
  }
}

async function getLines(stationId) {
  let con = null;
  try {
    con = await getConnection();
    const query = util.promisify(con.query).bind(con);

    // TODO: Validate input
    result = await query(`
        SELECT station_lines.Name FROM station_to_line
        INNER JOIN station_lines ON station_lines.ID = station_to_line.LineId
        WHERE station_to_line.StationId = "${stationId}"
    `);

    return result.map((item) => item.Name);
  } catch (err) {
    throw err;
  } finally {
    if (con) {
      con.end();
    }
  }
}

async function main() {
  const inputCommand = process.argv[2];
  const inputId = process.argv[3];

  if (
    !inputCommand ||
    (inputCommand !== "getStations" && inputCommand !== "getLines")
  ) {
    console.error(
      "Please specify correct command:\nnode query-database.js getStations <lineId>\nnode query-database.js getLines <stationId>"
    );
    exit();
  }

  if (inputCommand == "getLines") {
    const result = await getLines(inputId);
    for (item of result) {
      console.log(item);
    }
  } else if (inputCommand == "getStations") {
    const result = await getStations(inputId);
    for (item of result) {
      console.log(item);
    }
  }
}

main();
