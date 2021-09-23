const yargs = require("yargs");
const mysql = require("mysql");
var request = require("request");
const fs = require("fs");

module.exports = {
  DBConnect: function (dbName) {
    var dbURL = process.env.JAWSDB_URL;

    if (dbURL == null || dbURL == "")
      dbURL = "mysql://root:harry4657@localhost:3306/" + dbName;

    connection = mysql.createConnection(dbURL);

    return new Promise(function (resolve, reject) {
      connection.connect((error) => {
        if (error) {
          console.log("Error connecting to the database: " + error.name);
          reject(error);
        } else {
          console.log("Connected!");
          resolve(connection);
        }
      });
    });
  },

  wait: function (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        //console.log("Done waiting");
        resolve(ms);
      }, ms);
    });
  },

  ReadHistory: function (inputFilename) {
    // Return new promise
    return new Promise(function (resolve, reject) {
      // Do async job
      let rawdata = fs.readFileSync(inputFilename);
      let recentPlays = JSON.parse(rawdata);
      console.log(recentPlays);
      resolve(recentPlays);
    });
  },

  CountPlays: (connection) => {
    return new Promise((resolve, reject) => {
      var query = "SELECT COUNT(*) as playCount FROM plays;";

      console.log(query);

      connection.query(query, function (err, result) {
        if (err) {
          console.log("Count Plays error: " + err);

          reject();
        } else {
          resolve(result[0].playCount);
        }
      });
    });
  },

  MostPlayed: (connection, limit, offset) => {
    return new Promise((resolve, reject) => {
      var query =
        "select trackName, artistName, count(*) as times from plays where msPlayed >= 10000 group by trackName, artistName order by times desc LIMIT ? OFFSET ?;";
      var inputs = [limit, offset];

      query = connection.format(query, inputs);

      connection.query(query, function (err, result) {
        if (err) {
          console.log("Most Played error: " + err);

          reject();
        } else {
          resolve(result);
        }
      });
    });
  },

  PlayTime: (connection, limit, offset) => {
    return new Promise((resolve, reject) => {
      var query =
        "select trackName, artistName, sum(msPlayed) as timeListened from plays group by trackname, artistName order by timeListened desc limit ? offset ?;";
      var inputs = [limit, offset];

      query = connection.format(query, inputs);

      connection.query(query, function (err, result) {
        if (err) {
          console.log("Most Played error: " + err);

          reject();
        } else {
          resolve(result);
        }
      });
    });
  }
};
