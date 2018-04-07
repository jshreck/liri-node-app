require("dotenv").config();

var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var omdbKey = keys.omdb.key;

var command = process.argv[2];
var details = process.argv.slice(3).join(" ");

console.log("command: " + command + " details: " + details);

// * `my-tweets`
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
if (command === "my-tweets") {

     var params = {screen_name: "LIRI_J", count: 2};

     client.get('statuses/user_timeline/', params, function(error, tweets, response) {
         if (!error) {
         for (var key in tweets) {
            console.log(tweets[key].text);
          }
         }
     });
 }

// * `spotify-this-song`
// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
if (command === "spotify-this-song") {
    spotify
    .search({ type: 'track', query: details, limit: 1})
    .then(function(response) {
   var info = response.tracks.items[0];
    //   console.log(response.tracks.items);
            console.log 
            (`Artist(s): ${info.album.artists[0].name}, 
            Song Name: ${info.name}, 
            Album: ${info.album.name}, 
            Preview: ${info.preview_url}`);
    })
    .catch(function(err) {
      console.log(err);
    });
}
// If no song is provided then your program will default to "The Sign" by Ace of Base.

// * `movie-this`
// This will output the following information to your terminal/bash window:
if (command === "movie-this") {
    request(`http://www.omdbapi.com/?t=${details}&y=&plot=short&apikey=${omdbKey}`, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
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
    });
}
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

// * `do-what-it-says`
// sing the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.


// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.






