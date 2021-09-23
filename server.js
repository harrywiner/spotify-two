var tools = require("./src/tools");
var yargs = require("yargs");
var express = require("express");
var request = require("request");
const mysql = require("mysql");

const port = process.env.PORT || 8000;

// https://vast-castle-09510.herokuapp.com/
// https://git.heroku.com/vast-castle-09510.git

var app = express();

app.use(express.static(__dirname + "/public"));
app.use("/src", express.static(__dirname + "/src"));

console.log("Listening on " + port);
app.listen(port);

var connection = tools.DBConnect("spotify").then(connection => {
  return connection
});

app.get("/count-total-plays", function (req, res) {
  var dbPromise = tools.DBConnect("spotify");

  dbPromise.then((connection) => {
    var countPromise = tools.CountPlays(connection);

    countPromise.then((count) => {
      res.send({
        playCount: count,
      });

      return;
    });
  });
})

app.get("/most-played", function (req, res) {
  var dbPromise = tools.DBConnect("spotify");

  console.log("Offset: " + req.query.offset);
  console.log("Limit: " + req.query.limit);

  dbPromise.then((connection) => {
    var playPromise = tools.MostPlayed(
      connection,
      parseInt(req.query.limit),
      parseInt(req.query.offset)
    );

    playPromise.then((plays) => {
      res.send({
        mostPlayed: plays,
      });

      return;
    });
  });
});

app.get("/play-time", function (req, res) {
  var dbPromise = tools.DBConnect("spotify");

  console.log("Offset: " + req.query.offset);
  console.log("Limit: " + req.query.limit);

  dbPromise.then((connection) => {
    var playPromise = tools.PlayTime(
      connection,
      parseInt(req.query.limit),
      parseInt(req.query.offset)
    );

    playPromise.then((plays) => {
      res.send({
        playTime: plays,
      });
      return;
    });
  });
});

app.get('/total-play-time', async (req, res) => {
  var con = await tools.DBConnect("spotify");

  var msPlayed = await tools.TotalPlayTime(con)

  res.send({ msPlayed })
})
