$(document).ready(function () {
//      array for storing searched cities
    var searchHist = [];
    var APIkey = "166a433c57516f51dfab1f7edaed8413";
//      checks if user has been here before
    loadSearchHist();
//      click handler for search button
    $("#submit").on("click", function () {
        event.preventDefault();
        var cityName = $("#search").val();
        searchHist.push(cityName);
        createNewCityBtn(cityName);
        getCurrentWeather(cityName);
    });

//      click handler for searched city buttons
    $(".cityBtn").on("click", function() {
        var searchedCity = event.target.innerHTML;
        getCurrentWeather(searchedCity);
    });

//      loads current weather in city searched
    function getCurrentWeather(city) {
        $("#currentWeather").empty();
        $("#weatherForecast").empty();
        console.log($("#search").val());
        var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + APIkey;
//      Grab current city from API
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
//      add date
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            var curDate = year + "/" + month + "/" + day;
            var dateDiv = $("<div id='cityDate'>");
            dateDiv.text(curDate);
            $("#currentWeather").append(dateDiv);
//      add icon
            var curIcon = response.weather[0].icon;
            console.log(curIcon);
            var iconImg = $("<img>");
            iconImg.addClass("weatherImg");
            iconImg.attr("src", "http://openweathermap.org/img/wn/" + curIcon + "@2x.png")
            $("#currentWeather").append(iconImg);
//      add temperature
            var curTemp = response.main.temp;
            console.log(curTemp);
            var tempDiv = $("<div id='cityTemp'>");
            tempDiv.text("Current temperature = " + curTemp);
            $("#currentWeather").append(tempDiv);
//      add Humidity
            var curHumid = response.main.humidity;
            console.log(curHumid);
            var humidDiv = $("<div id='cityHumid'>");
            humidDiv.text("Humidity = " + curHumid);
            $("#currentWeather").append(humidDiv);
//      add Wind Speed
            var curWind = response.wind.speed;
            console.log(curWind);
            var windDiv = $("<div id='cityWind'>");
            windDiv.text("Wind Speed = " + curWind);
            $("#currentWeather").append(windDiv);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
//      add UV Index
            getUvIndex(lat, lon);
            var cityID = response.id;
            console.log(cityID);
//      add 5 day forecast
            fiveDayForecast(cityID);

        });

    };

//      builds 5 day forecast
    function fiveDayForecast(ID) {
        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?id=" + ID + "&units=imperial&cnt=5&APPID=" + APIkey;
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (fiveDay) {
            console.log(fiveDay);
//      gets todays date
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1;
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
//      loop creates 5 day cards with information for city searched
            for (var i = 0; i < fiveDay.list.length; i++) {
                var date = year + "/" + month + "/" + (day + i);
                var icon = fiveDay.list[i].weather[0].icon
                var temp = fiveDay.list[i].temp.day
                var humid = fiveDay.list[i].humidity
//      make card for forcast day
                var dayCard = $("<div class='card' style='width: 18rem;'>");
                var mkCard2 = $("<div class='card-body'>");
//      add date
                var mkCard3 = $("<h5 class='card-title'>" + date + "</h5>");
//      add icon"
                var mkCard4 = $("<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'</img>");
//      add Temperature
                var mkCard5 = $("<h6 class='card-subtitle mb-2 text-muted'>" + temp + " Deg</h6>");
//      add Humidity
                var mkCard6 = $("<h6 class='card-subtitle mb-2 text-muted'>" + humid + "%</h6>");
//      builds card div
                dayCard.append(mkCard2);
                mkCard2.append(mkCard3);
                mkCard2.append(mkCard4);
                mkCard2.append(mkCard5);
                mkCard2.append(mkCard6);
//      attaches card div to forecast display
                $("#weatherForecast").append(dayCard);
            };

        });

    };
//      creates UV index for current weather in searched city
    function getUvIndex(lat, lon) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvInd) {
            console.log(uvInd);
//      grabs UV index from response object
            var uvIndex = uvInd.value;
//      creates new div
            var uvDiv = $("<div id='cityUv'>");
//      adds text with UV index value
            uvDiv.text("UV Index = " + uvIndex);
//      attaches the info to the current weather display
            $("#currentWeather").append(uvDiv);
        });
    };

    function loadSearchHist() {
//      checks for saved city searches in local storage
        if (localStorage.getItem("cjWeatherBoard") === null) {
//      if it doesnt exsist, creates one
            localStorage.setItem("cjWeatherBoard", JSON.stringify(searchHist));
        } else {
//      if it does gets stored value
            var getStoredCities = localStorage.getItem("cjWeatherBoard");
//      converts from string to object
            var rehydrateStoredCities = JSON.parse(getStoredCities);
//      adds saved cities to empty array
            searchHist = rehydrateStoredCities;
        };
//      creates buttons for each saved city
        for (var i = 0; i < searchHist.length; i++) {
            var newBtn = $("<button class='cityBtn'>");
            newBtn.text(searchHist[i]);
            $("#searchedCities").append(newBtn);
        };
    };
//      creates button for searched city and to local storage
    function createNewCityBtn(cityName) {
        var newBtn = $("<button class='cityBtn'>");
        newBtn.text(cityName);
        $("#searchedCities").append(newBtn);
        localStorage.setItem("cjWeatherBoard", JSON.stringify(searchHist));
    };

});