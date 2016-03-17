$(document).ready(function() {
//necessary global variables for selector caching.
var $tempMode = $("#tempMode");
var $tempText = $("#temp-text");
var $windText = $("#wind-text");

//This calls the api with the correct coordinates provided by the getLocation function
  function getWeather(lat, lon) {
    var apiURI = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=5010c1c31418adb747728d8dd4c27a73";

    return $.ajax({
      url: apiURI,
      dataType: "json",
      type: "GET",
      async: "true",
    });
  }

//Passes the browser's geolocation into the getWeather function once its done the response from the getWeather call will be passed to the data handler for formatting.
  var counter = 0;

  function getLocation() {
    console.log("Update# " + counter++);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        getWeather(position.coords.latitude, position.coords.longitude).done(dataHandler);
      })
    } else {
      alert("geolocation not available");
    }
  }
  var updateInterval = setInterval(getLocation(), 300000);

// this function takes the temperature from the dataHandler and displays the temperature according to the correct temperature unit 


  function formatTemperature(kelvin) {
    
    
    var clicked = false;
    var fahr = ((kelvin * 9 / 5) - 459.67).toFixed(0);
    var cels = (kelvin - 273.15).toFixed(1);
    
    
      //initial temperature display
    $tempText.html(fahr);

    var firstClick = false;
    //click handler to update the temperature unit of measurement.
    $("#tempSwitch").off("click").on("click", function() {
      firstClick = true;
      console.log(clicked);
      clicked === false ? clicked = true : clicked = false;
      clicked === true ? $tempMode.html("C&deg") : $tempMode.html("F&deg");
      if (clicked) {
        $("#temp-text").html(cels);
      } else
        $("#temp-text").html(fahr);
    });

    
  }

  //handles response data and formats it accordingly since it is an asynchronous response object all data handling and formatting must be done within this function.
  function dataHandler(data) {

    formatTemperature(data.main.temp);

    if (data.main.temp && data.name && data.sys) {
      // display location name
      $("#city-text").html(data.name + ", " + data.sys.country);
      // display icon
      if (data.weather) {
        var imgURL = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
        $("#weatherImg").attr("src", imgURL);
        $("#weather-text").html(data.weather[0].description);
      }
      // display wind speed
      if (data.wind) {
        var knots = data.wind.speed * 1.9438445;
        $windText.html(knots.toFixed(1) + " Knots");
      }
    }
  }
});