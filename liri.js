//Setup
require("dotenv").config();
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdbKey = keys.omdb.key;

var command = process.argv[2];
var details = process.argv.slice(3).join(" ");

// log the command/details
fs.appendFile("log.txt", ` ${command} "${details}" ,`, function (error) {
    if (!error) {
        console.log("Added request to log");
    }
    else {
        console.log(error);
    }
});

//Calling the determine function and passing it the command
determine(command);

//Based on the command, will call the appropriate function
function determine(command) {
    if (command === "my-tweets") {
        getTweets();
    }
    else if (command === "spotify-this-song") {
        spotifySong();
    }
    else if (command === "movie-this") {
        getMovie();
    }
    else if (command === "do-what-it-says") {
        doIt();
    }
}


//gets most recent 20 tweets
function getTweets() {
    var params = { screen_name: "LIRI_J", count: 20 };

    client.get('statuses/user_timeline/', params, function (error, tweets, response) {
        if (!error) {
            for (var key in tweets) {
                console.log(tweets[key].text);
            }
        }
        else {
            console.log(error);
        }
    });

}

//Gets song information
function spotifySong() {
    if (!details) {
        details = "The Sign Ace of Base";
    }
    spotify
        .search({ type: 'track', query: details, limit: 1 })
        .then(function (response) {
            var info = response.tracks.items[0];
            console.log(`
            Artist(s): ${info.album.artists[0].name}, 
            Song Name: ${info.name}, 
            Album: ${info.album.name}, 
            Preview: ${info.preview_url}`);
        })
        .catch(function (err) {
            console.log(err);
        });
}

//Gets movie information
function getMovie() {
    if (!details) {
        details = "Mr.Nobody";
    }
    request(`http://www.omdbapi.com/?t=${details}&y=&plot=short&apikey=${omdbKey}`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);

            //use json stringify here?
            console.log("Title: " + movie.Title);
            console.log("Year Released: " + movie.Year);
            console.log("IMDB Rating: " + movie.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Produced in: " + movie.Country);
            console.log("Language(s): " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        }
        else {
            console.log(error);
        }
    });
}

//Reads a file and does what it says, passes a new command back into the "determine" function
function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
       
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        console.log(dataArr);

        command = dataArr[0];
        details = dataArr[1];
        determine(command);
    });
}








