app.service('httpService', ['$http', function ($http) {

  this.signUp = function (username, password, email) {

    var signupUser = {
      username : username,
      password : password,
      email : email
    };

    //signing up a new user
    return $http.post("/api/users", signupUser)
      .then(function (success) {
        return success.body;
      }, function (error) {
        return error;
        console.log(error);
      });
  };

  //adding favorite to users list of favorites
  this.sendFavorite = function (favorite) {

    var addToFavorites = {
      favorites: favorite
    };

    return $http.put("/api/users", addToFavorites)
      .then(function (success) {
        return success;
      }, function (error) {
        return error;
      });
  };

  //login functionality
  this.login = function () {
    $http.get('/login')
      .then(function (success) {
        return success;
      }, function (error) {
        return error;
      });
  };

  //getting tweets
  this.getTweets = function (searchTerm) {

    var getRequestGoesTo = '/api/tweets/' + searchTerm;

    return $http.get(getRequestGoesTo)
      .then(function (success) {
        return success.data;
      }, function (error) {
        return error;
      });
  }

   this.trending = function () {
      return $http.get({
        method: 'GET',
        url: 'https://api.twitter.com/1.1/trends/place'
      }).then(function(data){
        console.log(data);
        return data;
      }).catch(function(e){
        console.log(e);
      })

  }



}]);
