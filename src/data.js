

async function onload() {
    $.ajax({
        url: "/count-total-plays/",
    }).done(function (data) {
        console.log("Returned from SQL Query from " + data.playCount);
        $("#total-plays-count").text(data.playCount);
    });

    $.ajax({
        url: "/total-play-time",
    }).done(function (data) {
        console.dir(data)
        $('#total-time-count').html(FormatDays(data.msPlayed))
    })

    await $.ajax({
        url: "/most-played/?limit=100&offset=0",
    }).done((data) => {
        data.mostPlayed.map((element) => {
            element.trackName = formatTrackName(element.trackName);
            return element;
        });
        doLineNumbers(data.mostPlayed)
        table = document.getElementById("most-played-table");

        var headers = ["#", "trackName", "artistName", "timesPlayed"];
        //table.innerHTML = harry2Table(table, data.mostPlayed, headers);
        table.innerHTML = json2Table(data.mostPlayed);
    });

    await $.ajax({
        url: "/play-time/?limit=100&offset=0",
    }).done((data) => {
        data.playTime.map((element) => {
            element.trackName = formatTrackName(element.trackName);
            return element;
        });

        doLineNumbers(data.playTime)
        data.playTime.map((obj) => {
            let ms = obj.timeListened;
            obj.timeListened = FormatMS(ms);
        });

        table = document.getElementById("play-time-table");
        table.innerHTML = json2Table(data.playTime);
    });
}


// https://datatables.net/
function harry2Table(table, headers, json) {
    json.map((play, numPlay) => {
        var row = table.insertRow(numPlay);
        var num = row.insertCell(0);
        num.innerHTML = numPlay;
        headers.forEach((element, index) => {
            var cell = row.insertCell(index);
            cell.innerHTML = play[element];
        });
    });
}

function doLineNumbers(json) {
    return json.map((row, index) => Object.assign(row, { "#": index + 1 }));
}

function json2Table(json) {
    var cols = Object.keys(json[0]);

    //Map over columns, make headers,join into string
    let headerRow = cols.map((col) => `<th class="${col}">${col}</th>`).join("");

    //map over array of json objs, for each row(obj) map over column values,
    //and return a td with the value of that object for its column
    //take that array of tds and join them
    //then return a row of the tds
    //finally join all the rows together
    let rows = json
        .map((row, index) => {
            let tds = cols.map((col) => `<td class="${col}">${row[col]}</td>`).join("");
            return `<tr>${tds}</tr>`;
        })
        .join("");

    //build the table
    const table = `
              <table>
                  <thead>
                      <tr>${headerRow}</tr>
                  <thead>
                  <tbody>
                      ${rows}
                  <tbody>
              <table>`;

    return table;
}

function formatTrackName(str) {
    if (str.includes("-")) {
        str = str.substring(0, str.indexOf("-") - 1);
    }
    return str;
}

function modifyMS(json) {
    json.map((obj) => {
        obj.timeListened = ms;
        obj.timeListened = FormatMS(ms);
    });
}

function FormatMS(ms) {
    var milliseconds = parseInt((ms % 1000) / 100),
        seconds = Math.floor((ms / 1000) % 60),
        minutes = Math.floor((ms / (1000 * 60)) % 60),
        hours = Math.floor(ms / (1000 * 60 * 60));

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function FormatDays(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    // return days + " days " + hours + " h " + minutes + " m " + sec + " s";
    return `${days} <small>days</small> ${hours} <small>h</small> ${minutes} <small>min</small> ${sec} <small>sec</small>`
}

function show(id) {
    var tables = $('table')
    console.dir(tables)
    $('table').css('display', 'none')
    $(`#${id}`).css('display', 'block')
}