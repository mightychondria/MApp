var app = angular.module('app', ['signup', 'renderMap', 'renderMapRelational', 'ngAnimate', 'ngRoute'])
  .config(function ($routeProvider, $httpProvider, $locationProvider){
  $routeProvider
  .when('/liveTweets', {
    templateUrl: 'client/views/liveTweets.html',
    controller:'mapsPageController'
  })
  .when('/relational/:person', {
    templateUrl: 'client/views/relational.html',
    controller: 'mapsPageController'
  })



});

