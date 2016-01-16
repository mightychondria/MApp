var fs = require('fs');
var config = require('../config')
var Twit = require('twit');
<<<<<<< bc6a815d33e25ddb8a539e874e65bf0190b98a1f
var Promise = require("bluebird");
=======
>>>>>>> merged in the changes from upstream

var T = new Twit(config.twitter);

// var tweetStream = fs.createReadStream(T.stream('statuses/sample'));
//      tweetStream.on('data', function(chunk) {
//       data += chunk;
//      });


// var stream = T.stream('statuses/filter', {'locations':[-122.75,36.8,-121.75,37.8]})
<<<<<<< bc6a815d33e25ddb8a539e874e65bf0190b98a1f
// var w = fs.createWriteStream('./data/stream', {flags:'w'});
=======
var w = fs.createWriteStream('./data/stream', {flags:'w'});
>>>>>>> merged in the changes from upstream

// stream.on('tweet', function (tweet) {
//   w.write(JSON.stringify(tweet) + '\n');
// })

// T.get('statuses/user_timeline', { screen_name: 'dan_abramov', count: 200 },  function (err, data, response) {
//   if (err) throw err;
//   console.log(data);
//   T.get('application/rate_limit_status',  function (err, data, response) {
//     if (err) throw err;
//     console.log(data);
//     w.write(JSON.stringify(data));
//   });
// });

<<<<<<< 048eaa3beb2b0ecc8c70abc17da53d76fe1dff45
<<<<<<< bc6a815d33e25ddb8a539e874e65bf0190b98a1f


var getFriends = function(screen_name, depth, parent) {
  if (depth < 4) {
    var writeTo = fs.createWriteStream('./data/' + parent + '_' + screen_name, {flags: 'w'});

    T.get('friends/list', { screen_name: screen_name, count: 200 },  function (err, data, response) {
      if (err) {
        console.log(err);
      } else {
        writeTo.write(JSON.stringify(data));

        var topFour = data.users
        .filter(function (user) {
          if (user.status) {
            return user.status.coordinates || user.status.place;
          } else {
            return false;
          }
        })
        .sort(function (a, b) {
          return b.followers_count - a.followers_count;
        })
        .splice(0, 10);

        topFour.forEach(function (user) {
          requestQueue.push(function() {
            getFriends(user.screen_name, depth + 1, screen_name);
          });
        });
      }
    });
  } else {
    return;
  }
};

var requestQueue = [];

var handleRequestQueue = function () {
  // if rate limits OK
  if (rateLimitsOK) {
    requestQueue.unshift().call();
    handleRequestQueue();
  } else {
    setTimeout(function() {
      handleRequestQueue();
    }, 30000);
  }
};


var getLimit = function() {
  return new Promise(function (resolve, reject) {
    T.get('application/rate_limit_status', function (err, data, response) {
      if (err) { reject(err); }
      resolve(data);
    });
  });
};

var checkRateLimits = function() {
  getLimit().then(function(data) { 
    if (data.resources.friends['/friends/list'].remaining > 0 && requestQueue.length > 0) {
      requestQueue.shift().call();
      checkRateLimits();
    } else {
      setTimeout(function() {
        checkRateLimits();
      }, 10000);
    }
  });
};

requestQueue.push(function() {
  getFriends('KAKA', 0, 'origin');
});

checkRateLimits();
=======
var requestCount = 0;

var getFriends = function(screen_name, depth, parent) {
  if (requestCount >= 14) {
    console.log('setting time out, request count:', requestCount);
    console.log('Time', new Date().setUTCHours(4));
    setTimeout(function() {
    console.log('starting new 15-minute wait')
      requestCount = 0;
      getFriends(screen_name, depth, parent);
    }, 1100000);
  } else {
    requestCount++;
    setTimeout(function () {
      if (depth < 10 && requestCount < 15) {
        var writeTo = fs.createWriteStream('./data/' + parent + '_' + screen_name, {flags: 'w'});
        T.get('friends/list', { screen_name: screen_name, count: 200 },  function (err, data, response) {
          if (err) {
            console.log(err);
          } else {

            writeTo.write(JSON.stringify(data));

            var topFour = data.users
            .filter(function (user) {
              if (user.status) {
                return user.status.coordinates || user.status.place;
              } else {
                return false;
              }
            })
            .sort(function (a, b) {
              return b.followers_count - a.followers_count;
            })
            .splice(0, 10);

            topFour.forEach(function (user) {
              getFriends(user.screen_name, depth + 1, screen_name);
            });
          }
        });
      }
      
    }, (Math.random() * 120000) + 30000);
  }
};

getFriends('POTUS', 0, 'origin');
>>>>>>> graph fetching built out

// T.get('application/rate_limit_status',  function (err, data, response) {
//   if (err) throw err;
//   console.log(data.resources.friends['/friends/list']);
//   console.log(data.resources.followers['/followers/list']);
<<<<<<< 048eaa3beb2b0ecc8c70abc17da53d76fe1dff45
//   console.log(data.resources.application['/application/rate_limit_status']);
// });
=======
// var getFriends = function(screen_name, depth, parent) {
//   setTimeout(function () {
//     if (depth < 3) {
//       var writeTo = fs.createWriteStream('./data/' + parent + '_' + screen_name, {flags: 'w'});
//       T.get('followers/list', { screen_name: screen_name, count: 200 },  function (err, data, response) {
//         if (err) {
//           console.log(err);
//         } else {

//           writeTo.write(JSON.stringify(data));

//           var topFour = data.users.sort(function (a, b) {
//             return b.followers_count - a.followers_count;
//           }).splice(0, 2);

//           topFour.forEach(function (user) {
//             getFriends(user.screen_name, depth + 1, screen_name);
//           });
//         }
//       });
//     }
    
//   }, Math.random() * 5);
// };

// getFriends('dan_abramov', 0, 'origin');

T.get('application/rate_limit_status',  function (err, data, response) {
  if (err) throw err;
  console.log(data);
  w.write(JSON.stringify(data));
});
>>>>>>> merged in the changes from upstream
=======
//   w.write(JSON.stringify(data));
// });
>>>>>>> graph fetching built out
