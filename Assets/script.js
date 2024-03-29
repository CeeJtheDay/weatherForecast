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
        if (cityName === "") {
            alert("Search bar cannot be left blank. Please enter a city name.");
        } else {
            searchHist.push(cityName);
            createNewCityBtn(cityName);
            getCurrentWeather(cityName);
        };
    });


    //      click handler for searched city buttons
    $(".cityBtn").on("click", function () {
        var searchedCity = event.target.innerHTML;
        getCurrentWeather(searchedCity);
    });

    //      loads current weather in city searched
    function getCurrentWeather(city) {
        $("#currentWeather").empty();
        $("#weatherForecast").empty();
        console.log($("#search").val());
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + APIkey;
        //      Grab current city from API
        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            //      add current weather card
            mkCurrentCard(response, city);
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
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast/daily?id=" + ID + "&units=imperial&cnt=5&APPID=" + APIkey;
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function (fiveDay) {
            console.log(fiveDay);
            //      loop creates 5 day cards with information for city searched
            for (var i = 0; i < fiveDay.list.length; i++) {
                mkForecastCard(fiveDay, i);
            };

        });

    };
    //      creates UV index for current weather in searched city
    function getUvIndex(lat, lon) {
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvInd) {
            console.log(uvInd);
            //      grabs UV index from response object
            var uvIndex = uvInd.value;
            //      creates new div
            var uvDiv = $("<h6 class='card-subtitle mb-2'>UV Index = " + uvIndex + "</h6>");
            //      adds text with UV index value
            uvDiv.text("UV Index = " + uvIndex);
            //      attaches the info to the current weather display
            $("#UVhere").append(uvDiv);
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
            var newBtn = $("<button class='cityBtn btn btn-outline-light'>");
            newBtn.text(searchHist[i]);
            $("#searchedCities").append(newBtn);
        };
    };
    //          creates button for searched city and to local storage
    function createNewCityBtn(cityName) {
        var newBtn = $("<button class='cityBtn btn btn-outline-light'>");
        newBtn.text(cityName);
        $("#searchedCities").append(newBtn);
        localStorage.setItem("cjWeatherBoard", JSON.stringify(searchHist));
    };
    //          creates and populates current weather card
    function mkCurrentCard(response, city) {
        //      get date
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        //      format date
        var date = year + "/" + month + "/" + day;
        //      get icon id
        var icon = response.weather[0].icon;
        //      get temp
        var temp = response.main.temp;
        //      get humidity
        var humid = response.main.humidity;
        //      get wind speed
        var wind = response.wind.speed;
        //      make card for forcast day
        var dayCard = $("<div id='curCard' class='card' style='width: 18rem;'>");
        //      add body to card
        var mkCard1 = $("<div id= 'UVhere' class='card-body'>");
        //      add City Name
        var mkCard2 = $("<h5 class='card-title'>" + city + "</h5>");
        //      add date
        var mkCard3 = $("<h5 class='card-title'>" + date + "</h5>");
        //      add icon"
        var mkCard4 = $("<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'</img>");
        //      add Temperature
        var mkCard5 = $("<h6 class='card-subtitle mb-2'>" + temp + "°F</h6>");
        //      add Humidity
        var mkCard6 = $("<h6 class='card-subtitle mb-2'>" + humid + "% Humidity</h6>");
        //      add Wind Speed
        var mkCard7 = $("<h6 class='card-subtitle mb-2'>" + wind + " Mph</h6>");
        //      builds card div
        dayCard.append(mkCard1);
        mkCard1.append(mkCard2);
        mkCard1.append(mkCard3);
        mkCard1.append(mkCard4);
        mkCard1.append(mkCard5);
        mkCard1.append(mkCard6);
        mkCard1.append(mkCard7);
        //      attaches card div to forecast display
        $("#currentWeather").append(dayCard);
    }
        //      creates and populates 5 forecast cards
    function mkForecastCard(fiveDay, x) {
        //      get date
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        //      format date
        var date = year + "/" + month + "/" + (day + x);
        //      gets icon id
        var icon = fiveDay.list[x].weather[0].icon
        //      get temp
        var temp = fiveDay.list[x].temp.day
        //      get humidity
        var humid = fiveDay.list[x].humidity
        //      make card for forcast day
        var dayCard = $("<div class='card' style='width: 18rem;'>");
        var mkCard2 = $("<div class='card-body'>");
        //      add date
        var mkCard3 = $("<h5 class='card-title'>" + date + "</h5>");
        //      add icon"
        var mkCard4 = $("<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'</img>");
        //      add Temperature
        var mkCard5 = $("<h6 class='card-subtitle mb-2'>" + temp + "°F</h6>");
        //      add Humidity
        var mkCard6 = $("<h6 class='card-subtitle mb-2'>" + humid + "% Humidity</h6>");
        //      builds card div
        dayCard.append(mkCard2);
        mkCard2.append(mkCard3);
        mkCard2.append(mkCard4);
        mkCard2.append(mkCard5);
        mkCard2.append(mkCard6);
        //      attaches card div to forecast display
        $("#weatherForecast").append(dayCard);
    }

});