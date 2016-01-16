var renderMap = angular.module('renderMap', []);

renderMap.directive('renderMap', function(){

  //define function to be attributed to the link property on the returned object below
  var link = function(scope, element, attrs) {
      if(map){
        map.remove();
      }
      //define map elements/styles
      var map;
      var mapMarkers = [];
      var markerLimit = 500;
      var styles = [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]

      //set initial config variables
      var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 2,
          minZoom: 2,
          mapTypeControl: true,
          mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
            },
          scrollwheel: true,
          styles: styles
      };

      //define function that will inititialize the map

          if (map === void 0) {
              map = new L.Map("map", {center: [37.8, 20], zoom: 2, minZoom:2})
                  .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));

              window.map = map;
              var svg = d3.select(map.getPanes().overlayPane).append("svg"),
              g = svg.append("g").attr("class", "zoomAinmation");
              L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);


          }


  };


  //custom directives expect a return object in the format below...
  return {
      //restrict specifies how directive can be invoked on DOM
      restrict: 'E',
      replace: false,
      link: link
  };

});

