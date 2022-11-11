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

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass12345", //TODO: Use .env file
    database: "london",
  });

  const query = util.promisify(con.query).bind(con);

  con.end();
}

main();
