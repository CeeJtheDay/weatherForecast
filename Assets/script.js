// object for storing previous cities searched
var citiesSearched = {};
// creates a new div
var newDiv = $("<div>");
// -------USER FLOW---------
// user arrives at page
//  Check local storage for stored object
// user enters a city ro get ciurrent weather
//      i. capture the value of input box
var cityName = $("#search").val();
//      ii. add it to the query URL

//  1. ajax call
//      i. build query URL
var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&APPID=" + APIkey;
var forecastUrl;
//      11. build api key variable
var APIkey = "744a700e87c190e4236cfc5a94cd8aff";
//      111. response funtion
function getCityWeather() {
$.ajax ({
    url: currentWeatherURL,
    method: "GET"
}).then (function(response) {
    console.log(response);
    var curTemp = response.main.temp;
    console.log(curTemp);
    var curHumid = response.main.humidity;
    console.log(curHumid);
    var curWind = response.wind.speed;
    console.log(curWind);
    var uvIndex;

    var cityID = response.id
    console.log(cityID);
    forecastURL =  "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID +"&APPID=" + APIkey;
    $.ajax ({
        url: forecastURL,
        method: "GET"
    }).then
    
    })
};

// current weather is displayed to right
//  2. Grab current city from API function showCurretCity ()
//      show city namew and todays date
//      i. temperature
//      11. Humidity
//      iii. Wind Speed
//      iiii. UV index

// 5 day forecast is diplayed below current weather
//      i. 5 days starting with today
//      ii. temperature
//      iii. Humidity
//      iiii. widget for what the weather is

// city name is added to list and stored to session storage
//  3. create button with city name
//  4. append it to the Search Div
//  5. store the city name to object
//  6. store object to local storage