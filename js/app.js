const key = "e520e248b2ce5d233b45cf74840ed29c";
let weather = {}


if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);

} else {
  alert("browser dosen't support geolocation");
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

function showError(error) {
  console.log(error);
}

//Forecast 5 day / 3 hours weather
function forecast(location, cityName) {

  let api2 = `http://api.openweathermap.org/data/2.5/${location}&appid=e520e248b2ce5d233b45cf74840ed29c&units=metric`;
  fetch(api2).then(function (response) {

      let data2 = response.json();
      return data2;
    })
    .then(function (data2) {
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let k = data2.list.length;
      $('.location-header').html(`Forecast 5day / every 3 hours for: ${cityName}`);
      $('.weather-container').html('');
      for (let i = 0; i < k; i++) {

        var currentData = data2.list[i].dt_txt;




        var y = new Date(currentData);
        var currentMonthDay = y.getDate();
        var dayName = days[y.getDay()];
        var hours = y.getHours();
        var minutes = y.getMinutes() + "0";
        let currentMonth = y.getMonth() + 1;


        let info = data2.list[i].weather[0].main;
        let idIcon = data2.list[i].weather[0].icon;
        let temp = Math.round(data2.list[i].main.temp);



        if (i == 0) {
          var currentDay = new Date(data2.list[i].dt_txt).getDay()
          var prevDay = new Date(data2.list[i].dt_txt).getDay()
        } else {
          var currentDay = new Date(data2.list[i].dt_txt).getDay()
          var prevDay = new Date(data2.list[i - 1].dt_txt).getDay()
        }

        if (i == 0) {
          $('.weather-container').append(
            `<div id="${currentDay}" class="forecast-row row">
            <h4 class="col-12">${dayName}</h4> 
            <h5 class="col-12">${currentMonthDay}.${currentMonth}</h5>
              <div class="hour-wrapper col-3">
                <div class="hour-background">
                <p class="lead-hour">${hours}:${minutes}</p>
                <img src='images/icons/${idIcon}.png' alt="#">
                <p>${info}</p>
                <p class="temp">${temp} &deg;C</p>
                
                </div>
              </div>
            </div>`
          )
        } else if (currentDay == prevDay) {

          $(`div[id=${currentDay}]`).append(
            ` <div class="hour-wrapper  col-3">
                <div class="hour-background">
                  <p class="lead-hour">${hours}:${minutes}</p>
                  <img src='images/icons/${idIcon}.png' alt="#">
                  <p>${info}</p>
                  <p class="temp">${temp} &deg;C</p>
                  
                </div>
              </div>`
          )
        } else {
          $('.weather-container').append(
            `<div id="${currentDay}"  class="forecast-row row"> 
                <h4 class="col-12">${dayName}</h4> 
                <h5 class="col-12">${currentMonthDay}.${currentMonth}</h5>
                <div class="hour-wrapper  col-3">
                    <div class="hour-background">
                    <p class="lead-hour">${hours}:${minutes}</p>
                    <img src='images/icons/${idIcon}.png' alt="#">
                    <p>${info}</p>
                    <p class="temp">${temp} &deg;C</p>
                    
                  </div>
              </div>
            </div>`
          )
        }
      }
    })
}

// Weather with lat and long
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
  console.log(api);
  fetch(api).then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temp = data.main.temp;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.info = data.weather[0].main;
      weather.icon = data.weather[0].icon;
      console.log(data);
      displayWeather();
      forecast(`forecast?lat=${latitude}&lon=${longitude}`, weather.city);
    })

  function displayWeather() {
    $('.temp').html(Math.round(weather.temp) + " &deg;C");

    $('img.icon-img').attr('src', `images/icons/${  weather.icon}.png`);
    $('.info').html(weather.info);
    $('.city').html(weather.city);
    $('.country').html(weather.country);
  }
}

//Search by city name
function bySearch(){
  let cityName = $('#city-name').val();

  api = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`;
  fetch(api).then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temp = data.main.temp;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.info = data.weather[0].main;
      weather.icon = data.weather[0].icon;
      console.log(data);
      displayWeather();
      forecast(`forecast?q=${cityName}`, cityName);
    })

  function displayWeather() {

    $('img.icon-img').attr('src', `images/icons/${  weather.icon}.png`);
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

})