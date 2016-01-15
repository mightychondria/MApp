// Import twit npm module
var Twit = require('twit');
// Imports twitter credential config

if(!process.env.CONSUMER_KEY){
  var twitterCredentials = require('../../config.js').twitter;
}

var T = new Twit({
    "consumer_key": process.env.CONSUMER_KEY || twitterCredentials["consumer_key"],
    "consumer_secret": process.env.CONSUMER_SECRET || twitterCredentials["consumer_secret"],
    "access_token": process.env.ACCESS_TOKEN || twitterCredentials["access_token"],
    "access_token_secret": process.env.ACCESS_TOKEN_SECRET || twitterCredentials["access_token_secret"]
});

module.exports = {

  // getTweets: Function that gets the 'n' most recent tweets given a query string and a number n
  trendingTweets: function(req, res) {
    console.log('in api')
    T.get('trends/place', {id: '1'}, function(error, data, response){
      if(error){
        return error;
      }
      res.json(data[0].trends.sort(function(a,b){
        if(a.tweet_volume>b.tweet_volume){
          return -1;
        }
        if(a.tweet_volume<b.tweet_volume){
          return 1
        }
        return 0;
      }));
    });
  },


  // streamTweets: Function that streams tweets with a location or geocode provided
  streamTweets: function(query, callback) {
    var stream = T.stream('statuses/filter', {'locations':['-180','-90','180','90']})
    stream.on('tweet', callback);

  }




};


