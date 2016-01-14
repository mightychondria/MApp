var Twit = require('twit')
var fs = require('fs')
var T = new Twit({
    consumer_key:         '6OuYBgJc512LiXfsxSi1gU1pz'
  , consumer_secret:      'fsXLqWXBSh0dbetUvRoQLs09tjx6e8HWBzNxRX4SQtqqAFSnP2'
  , access_token:         '4749449767-LMcracvDFEB9DtjyCC63etEV2t9DyqcSsoT9fde'
  , access_token_secret:  'c0OgwAKTiCOLmaKD991GvSeCVWgO5RyATGxyiCDRqBP7q'
})

var stream = T.stream('statuses/sample')
var write = fs.createWriteStream('./data')
stream.on('tweet', function (tweet) {
  console.log(tweet)
})