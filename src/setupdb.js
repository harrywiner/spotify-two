const fs = require("fs");
const mysql = require("mysql");
const tools = require("./tools");

function ReadHistory(filename) {
  let rawdata = fs.readFileSync(filename);

  let recentPlays = JSON.parse(rawdata);
  return recentPlays;
}




async function addToDatabase(play, con) {
  var sql =
    "INSERT INTO plays (trackName, artistName, endTime, msPlayed) VALUES (?, ?, ?, ?);";
  var inputs = [play.trackName, play.artistName, play.endTime, play.msPlayed];

  sql = con.format(sql, inputs);

  await con.query(sql, function (err, result, fields) {
    if (err) throw err;
  });
}
// replaces all single quotes with sql escaped single quotes
function formatString(str) {
  var formatStr = str.replace(/'/g, "''");
  if (formatStr.length >= 32) {
    formatStr = formatStr.substr(0, 32);
  }

  return formatStr;
}

async function insertHistory(filename, con) {
  var recentPlays = ReadHistory(filename);
  for (i = 0; i < recentPlays.length; i++) {
    recentPlays[i].trackName = formatString(recentPlays[i].trackName);
    recentPlays[i].artistName = formatString(recentPlays[i].artistName);
    await addToDatabase(recentPlays[i], con);
    await tools.wait(10);
    if (i % 1000 == 0) {
      console.log(`Done with ${i} entries`)
    }
  }
}
// todo make i value in  for loop determine amount
// insertHistory("./json/StreamingHistory0.json");

/*
  insertHistory("./json/StreamingHistory1.json");
  insertHistory("./json/StreamingHistory2.json");
  insertHistory("./json/StreamingHistory3.json");

  
  */

async function main() {
  var con = await tools.DBConnect("spotify")
  var setup = "DROP TABLE plays;";
  var setup2 =
    "CREATE TABLE plays (playID INT AUTO_INCREMENT,trackName varchar (32),artistName varchar (32),endTime varchar (32),msPlayed INT,PRIMARY KEY (playID))";

  con.query(setup, function (err, result, fields) {
    if (err) throw err;
  });

  con.query(setup2, function (err, result, fields) {
    if (err) throw err;
  });
  await insertHistory("./json/StreamingHistory1.json", con);
  console.log("Done history 1")
  await insertHistory("./json/StreamingHistory2.json", con);
  console.log("Done history 2")
  await insertHistory("./json/StreamingHistory3.json", con);
  console.log("Done history 3")
  await insertHistory("./json/StreamingHistory4.json", con);
  console.log("Done history 4")
  await insertHistory("./json/StreamingHistory5.json", con);
  console.log("Done history 5")
  await insertHistory("./json/StreamingHistory6.json", con);
  console.log("Done history 6")
  await insertHistory("./json/StreamingHistory7.json", con);
  console.log("Done history 7")
  await insertHistory("./json/StreamingHistory8.json", con);
  console.log("Done history 8")
  con.end();
}

main();
