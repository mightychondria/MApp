// Setup server dependencies
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require("passport");
var session = require('express-session');
var TwitterStrategy = require("passport-twitter").Strategy;
var routes = require('./routes/routes.js');
var socketio = require('socket.io');
var TwitterAPI = require('./controllers/twitterApiController.js');
var textSearch = require('./textSearch.js');
var Auth = require('./auth/auth.js');
var fs  = require('fs');
// **Important password and keys **
if(!process.env.CONSUMER_KEY){
  var KEYS = require('../config.js');
}

// Setup server to listen on process.en.PORT delegating to port 3000
var port = 3000;
// var key = process.env.DB_USER || KEYS.user;
// var db_pass = process.env.DB_PASSWORD || KEYS.password;

//init socketStream to null
var stream = null;
var twitterTopic;
// ** NEED TO IMPLEMENT Setup server to listen to MongoLab URI delegating to local db
var mapDB = process.env.MONGOLAB_URI || 'mongodb://localhost/mapApp'
// 'mongodb://' + key + ':' + db_pass + '@ds039095.mongolab.com:39095/users-tweets';
mongoose.connect(mapDB);
// Set Up Authorization
Auth.initialize();
// Setup app and routing
var app = express();
// Use Session Middleware
app.use(session({
  secret:'Keyboard Cat',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());


// Set up middleware stack
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../')));


/* Routes */
app.use('/', routes);

//socket.io code below

var server = app.listen(port);
console.log('App listening on ' + port);

var io = socketio.listen(server);

var tweetStream;

// Create web socket connection
io.sockets.on('connection', function(socket) {
 socket.on('tweet flow', function() {

   if (stream === null) {
     stream = true;
     console.log('connected');

      TwitterAPI.streamTweets(twitterTopic, function(data) {

      // console.log(data.coordinates, data.place, data.place.bounding_box)
        if(data.user.geo_enabled){

          if(data.coordinates !== null || data.place !== null){

            // write.write(JSON.stringify(data) );
            var tweetObject = data;
            var topicExists;
            var hashTagExists;

            //looking for search term within the text of the tweet
            if(twitterTopic !== undefined) {

              topicExists = textSearch.findTwitterTopic(twitterTopic, tweetObject.text);
              // console.log(topicExists)
            }
            if(twitterTopic !== undefined && data.entities.hashtags.length !== 0){

              hashTagExists = textSearch.findHashTag(twitterTopic, tweetObject.entities.hashtags);
            }
            //creating an object with useful properties
            if (twitterTopic === undefined || topicExists === true || hashTagExists === true) {
              var scrubbedTweetObject = {
                name: tweetObject.user['name'],
                handle: tweetObject.user['screen_name'],
                verified: tweetObject.user['verified'],
                createdAt: tweetObject.user['created_at'],
                description: tweetObject.user['description'],
                url: tweetObject.user['url'],
                followers_count: tweetObject.user['followers_count'],
                friends_count: tweetObject.user['friends_count'],
                timezone: tweetObject.user['time_zone'],
                coordinates: tweetObject['coordinates'] ? tweetObject['coordinates']['coordinates'] : tweetObject['place']['bounding_box']['coordinates'][0][0],
                geo: tweetObject['geo'],
                place: tweetObject['place'],
                tweetText: tweetObject['text'],
                tweetTime: tweetObject['created_at'],
                retweet_count: tweetObject['retweet_count'],
                favorite_count: tweetObject['favorite_count']
              };

              // emit to client and send back tweet object
              socket.broadcast.emit("tweet-stream", scrubbedTweetObject);
              socket.emit("tweet-stream", scrubbedTweetObject);

              //changing twitterTopic to return new data related to twitterTopic mid-stream
              //below causes a memory leak (global variable)

            }
            //Tweet Object that has been scrubbed for relevant data

          }
        }
      });
    }
  });
  socket.on('filter', function(topic) {
    console.log('in filter' , topic.replace(/\s/g, ''))
                twitterTopic = topic.replace(/\s/g, '');
              });
  socket.on("disconnect", function() {
    console.log('disconnected');
  });
  socket.emit("connected");
});

module.exports = app;
