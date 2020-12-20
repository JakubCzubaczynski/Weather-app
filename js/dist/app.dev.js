"use strict";

$(document).ready(function () {
  var key = "e520e248b2ce5d233b45cf74840ed29c";
  var weather = {};

  var setPosition = function setPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  };

  var showError = function showError(error) {
    console.log(error);
  };

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  } else {
    alert("browser dosen't support geolocation");
  }

  $('.location').click(function () {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  }); //Forecast 5 day / 3 hours weather

  function forecast(location, cityName) {
    var api2 = "https://api.openweathermap.org/data/2.5/".concat(location, "&appid=e520e248b2ce5d233b45cf74840ed29c&units=metric");
    fetch(api2).then(function (response) {
      var data2 = response.json();
      return data2;
    }).then(function (data2) {
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var k = data2.list.length;
      $('.location-header').html("Forecast 5day / every 3 hours for: ".concat(cityName));
      $('.weather-container').html('');

      for (var i = 0; i < k; i++) {
        var currentDay = void 0,
            prevDay = void 0;
        var currentData = data2.list[i].dt_txt;
        var newData = new Date(currentData);
        var currentMonthDay = newData.getDate();
        var dayName = days[newData.getDay()];
        var hours = newData.getHours();
        var minutes = newData.getMinutes() + "0";
        var currentMonth = newData.getMonth() + 1;
        var info = data2.list[i].weather[0].main;
        var idIcon = data2.list[i].weather[0].icon;
        var temp = Math.round(data2.list[i].main.temp);

        if (i == 0) {
          currentDay = new Date(data2.list[i].dt_txt).getDay();
          prevDay = new Date(data2.list[i].dt_txt).getDay();
        } else {
          currentDay = new Date(data2.list[i].dt_txt).getDay();
          prevDay = new Date(data2.list[i - 1].dt_txt).getDay();
        }

        if (i == 0) {
          $('.week-list').html("\n          <div class='col-2 py-3 day-wrapper' data-name='".concat(dayName, "'>").concat(dayName, "</div>"));
          $('.weather-container').append("<div id=\"".concat(currentDay, "\"  data-day='").concat(dayName, "' class=\"forecast-row row\">\n            <h4 class=\"col-12\">").concat(dayName, "</h4> \n            <h5 class=\"col-12\">").concat(currentMonthDay, ".").concat(currentMonth, "</h5>\n              <div class=\"hour-wrapper col-3\">\n                <div class=\"hour-background\">\n                <p class=\"lead-hour\">").concat(hours, ":").concat(minutes, "</p>\n                <img src='images/icons/").concat(idIcon, ".png' alt=\"#\">\n                <p>").concat(info, "</p>\n                <p class=\"temp\">").concat(temp, " &deg;C</p>\n                \n                </div>\n              </div>\n            </div>"));
        } else if (currentDay == prevDay) {
          $("div[id=".concat(currentDay, "]")).append(" <div class=\"hour-wrapper  col-3\">\n                <div class=\"hour-background\">\n                  <p class=\"lead-hour\">".concat(hours, ":").concat(minutes, "</p>\n                  <img src='images/icons/").concat(idIcon, ".png' alt=\"#\">\n                  <p>").concat(info, "</p>\n                  <p class=\"temp\">").concat(temp, " &deg;C</p>\n                  \n                </div>\n              </div>"));
        } else {
          $('.week-list').append("\n          <div class='col-2 py-3 day-wrapper' data-name='".concat(dayName, "'>").concat(dayName, "</div>"));
          $('.weather-container').append("<div id=\"".concat(currentDay, "\" data-day='").concat(dayName, "' class=\"forecast-row row hide\"> \n                <h4 class=\"col-12\">").concat(dayName, "</h4> \n                <h5 class=\"col-12\">").concat(currentMonthDay, ".").concat(currentMonth, "</h5>\n                <div class=\"hour-wrapper  col-3\">\n                    <div class=\"hour-background\">\n                    <p class=\"lead-hour\">").concat(hours, ":").concat(minutes, "</p>\n                    <img src='images/icons/").concat(idIcon, ".png' alt=\"#\">\n                    <p>").concat(info, "</p>\n                    <p class=\"temp\">").concat(temp, " &deg;C</p>\n                    \n                  </div>\n              </div>\n            </div>"));
        }
      }
    });
  } // Weather with lat and long


  function getWeather(latitude, longitude) {
    var api = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&appid=").concat(key, "&units=metric");
    fetch(api).then(function (response) {
      var data = response.json();
      return data;
    }).then(function (data) {
      weather.temp = data.main.temp;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.info = data.weather[0].main;
      weather.icon = data.weather[0].icon;
      displayWeather();
      forecast("forecast?lat=".concat(latitude, "&lon=").concat(longitude), weather.city);
    });

    function displayWeather() {
      $('.temp').html(Math.round(weather.temp) + " &deg;C");
      $('img.icon-img').attr('src', "images/icons/".concat(weather.icon, ".png"));
      $('.info').html(weather.info);
      $('.city').html(weather.city);
      $('.country').html(weather.country);
    }
  } //Search by city name


  function bySearch() {
    var cityName = $('#city-name').val();
    api = "https://api.openweathermap.org/data/2.5/weather?q=".concat(cityName, "&appid=").concat(key, "&units=metric");
    fetch(api).then(function (response) {
      var data = response.json();
      return data;
    }).then(function (data) {
      weather.temp = data.main.temp;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.info = data.weather[0].main;
      weather.icon = data.weather[0].icon;
      displayWeather();
      forecast("forecast?q=".concat(cityName), cityName);
    });

    function displayWeather() {
      $('img.icon-img').attr('src', "images/icons/".concat(weather.icon, ".png"));
      $('.temp').html(Math.round(weather.temp) + " &deg;C");
      console.log(weather);
      $('.info').html(weather.info);
      $('.city').html(weather.city);
      $('.country').html(weather.country);
    }

    $("form").submit(function (e) {
      e.preventDefault();
    });
  }

  $('.check').click(function () {
    bySearch();
  });
  $('.week-list').on('click', '.day-wrapper', function (e) {
    var day = $(this).attr('data-name');
    $(".forecast-row[data-day]").addClass('hide');
    $(".forecast-row[data-day='".concat(day, "']")).removeClass('hide');
    $(".forecast-row[data-day='".concat(day, "']")).addClass('animation');
  });
});