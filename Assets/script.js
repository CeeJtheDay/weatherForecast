// object for storing previous cities searched
// var citiesSearched = {};
// creates a new div
// -------USER FLOW---------
// user arrives at page
//  Check local storage for stored object
// user enters a city ro get ciurrent weather
//      i. capture the value of input box
//      ii. add it to the query URL
//  1. ajax call
//      i. build query URL
//      11. build api key variable
//      111. response funtion
$(document).ready(function () {
    var searchHist = [];
    var APIkey = "166a433c57516f51dfab1f7edaed8413";
    // loadSearchHist();
    $("#submit").on("click", function () {
        event.preventDefault();
        var cityName = $("#search").val();
        searchHist.push(cityName);
        createNewCityBtn(cityName);
        getCurrentWeather(cityName);
    });


    function getCurrentWeather(city) {
        console.log($("#search").val());
        var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + APIkey;
        //  2. Grab current city from API
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //      i. temperature
            var curTemp = response.main.temp;
            console.log(curTemp);
            var tempDiv = $("<div id='cityTemp'>");
            tempDiv.text("Current temperature = " + curTemp);
            $("#currentWeather").append(tempDiv);
            //      11. Humidity
            var curHumid = response.main.humidity;
            console.log(curHumid);
            var humidDiv = $("<div id='cityHumid'>");
            humidDiv.text("Humidity = " + curHumid);
            $("#currentWeather").append(humidDiv);
            //      iii. Wind Speed
            var curWind = response.wind.speed;
            console.log(curWind);
            var windDiv = $("<div id='cityWind'>");
            windDiv.text("Wind Speed = " + curWind);
            $("#currentWeather").append(windDiv);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUvIndex(lat, lon);
            var cityID = response.id;
            console.log(cityID);
            //      iiii. UV Index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            getUvIndex(lat, lon);
            //      iiiii. 5 day forecast
            fiveDayForecast(cityID)
            
        });

    };

    function fiveDayForecast(ID) {
        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + ID + "&units=imperial&cnt=5&APPID=" + APIkey;
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (fiveDay) {
            console.log(fiveDay);

        });

    };

    function getUvIndex(lat, lon) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon + "&cnt=1";
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvInd){
            console.log(uvInd);
        })
    }

    // function loadSearchHist() {
    //     searchHist = localStorage.getItem(JSON.parse("CJ's Weather Board"));
    //     if (localStorage.getItem(JSON.parse("CJ's Weather Board")) === null) {
    //         localStorage.setItem("CJ's Weather Board", JSON.stringify(searchHist));
    //     } 
    //     for (var i = 0; i < searchHist.length; i++) {
    //         var newBtn = $("<li class='cityBtn list-group-item>").text(searchHist[i]);
    //         $(".list-group").append(newBtn);
    //     }
    // }

    function createNewCityBtn(cityName) {
        var newBtn = $("<button class='cityBtn'>");
        newBtn.text(cityName);
        $("#searchedCities").append(newBtn);
    };

    
});

    

//      current weather is displayed to right
//      show city name and todays date
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