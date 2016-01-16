app.controller('mapsPageController', ['$scope', '$http', 'httpService', '$sce', "$timeout", function ($scope, $http, httpService, $sce, $timeout) {

  //////////////////////////////////////////MAPS PAGE CONTROLLER DRIVER//////////////////////////////////////////////
  $scope.trends = [];
  //create array that will contain data for ALL incoming tweets
  $scope.allTweets = {
    data: []
  };

  //create array that will contain data for ONLY quality/relevant tweets
  $scope.relevantTweets = [];

  //function that will ultimately
  $scope.favoriteSubmit = function () {
    httpService.sendFavorite($scope.favoriteField);
  };

  //used for relevantTweets
  $scope.addRelevantTweet = function(tweet){
    $scope.relevantTweets.unshift(tweet);
  }
  $scope.trending = function(){

    httpService.trending().then(function(results){
      for(var i = 0;i<5;i++){
        console.log(results.data[i])
        $scope.trends.push(i+1 + '. ' + results.data[i].name)
      }
    }).catch(function(err){
      console.log(err);
    });
  }

  ////////////////////////////////////////////CREATE AND OPEN SOCKET/////////////////////////////////////////////////////////

  var onInit = function() {

    ////////////////////////////////ASSUMPTIONS + DRIVERS FOR HANDLING DATA STREAM///////////////////////////////////////////

    //establish map drivers
    var maxNumOfTweetsAllowedOnMap = 1000;

    var heatmap = new google.maps.visualization.HeatmapLayer({
      radius: 15
    });

    var setMapOnAll = function(map) {
      for (var i = 0; i < $scope.allTweets.data.length; i++) {
        $scope.allTweets.data[i].setMap(map);
      }
    };
    var markers = new L.FeatureGroup();
    var clearMarkers = function(){
      console.log('clear')
      map.removeLayer(markers);
    };
    var deleteMarkers = function() {
      console.log('delete')
      map.removeLayer(markers);
      markers = new L.FeatureGroup();
    };

    //establish tweet relevancy criteria;
    var numOfFollowersToBeRelevant = 0;
    var numOfRetweetsToBeRelevant = 0;
    var maxNumOfRelevantTweetsAllowed = 1500000;


    //////////////////////////////////////////SET UP HEAT MAP///////////////////////////////////////////////////
    // $timeout(function(){
    //   heatmap.setMap(window.map);
    // }, 10);

    //////////////////////////////////////////CONNECT TO SOCKET///////////////////////////////////////////////
    if(io !== undefined) {
      //connects to socket
      var socket = io.connect();
      //uses socket to listen for incoming tweet stream

      //code is a little buggy, but should offer a good start for doing the following when a search request is submitted:
      // a) clearing the map, b) emitting a filter request to the stream and c) re-starting the heatmap

      // $scope.submitSearch = function () {
        deleteMarkers();
        socket.emit("filter", $scope.searchField);
      };

      socket.on('tweet-stream', function (data) {

      //   if($scope.allTweets.data.length > maxNumOfTweetsAllowedOnMap){
      //     var pinToRemove = $scope.allTweets.data.shift();
      //     pinToRemove.setMap(null);
      //   }

        ///////////////////////////////////DETERMINE RELEVANCE/QUALITY OF TWEET//////////////////////////////////
        //set relevant parameters
        // var numOfFollowers = data.followers_count;
        // var numOfRetweets = data.retweet_count;
        // var verifiedAccount = data.verified;
        // var tweetObject = {};
        // //if incoming tweet meets relevancy criteria...
        // if((numOfFollowers >= numOfFollowersToBeRelevant) || (numOfRetweets >= numOfRetweetsToBeRelevant)){
        //   //then check to see how many relevant tweets are already being displayed on page; if max limit
        //   //has already been reached then pop last item out of relevantsTweets array
        //   if($scope.relevantTweets.length === maxNumOfRelevantTweetsAllowed){
        //     $scope.relevantTweets.pop();
        //   }
        //   //for all incoming tweets that match criteria, create a tweetObject that contains most relevant info for tweet
        //   //(e.g. handle, content, and time);
        //   tweetObject = {
        //     handle: data.handle,
        //     text: data.tweetText,
        //     time: data.tweetTime
        //   };
        //   //add latest tweetObject to the beginning of the relevantTweets array;
        //   $scope.$apply(function() {
        //     $scope.addRelevantTweet(tweetObject);
        //   })
        // }

        ///////////////////////////////////PLACE ALL INCOMING TWEETS ON MAP///////////////////////////////////////

        var tweetLocation = [data["coordinates"][1], data["coordinates"][0]];
        //var tweetMarker = L.marker([data["coordinates"][1], data["coordinates"][0]]).addTo(map);

        var tweetMarker = L.marker(tweetLocation)
        tweetMarker.bindPopup('<div>' + data['name'] + ": " + data['tweetText'] + '</div>');;

        markers.addLayer(tweetMarker);
        map.addLayer(markers)
        //

      //   $scope.allTweets.data.push(tweetMarker);

      })


      socket.on('connected', function () {
        console.log('connected client');
        socket.emit('unfilter')
        socket.emit('tweet flow');
      })
    };

  };

  onInit();

}]);
