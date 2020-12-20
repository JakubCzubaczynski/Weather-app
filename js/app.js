$( document ).ready(function() {
const key = "e520e248b2ce5d233b45cf74840ed29c";
let weather = {}

const setPosition = (position) =>{
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  
  getWeather(latitude, longitude);
}

const showError = (error)=> {
  console.log(error);
}
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);

} else {
  alert("browser dosen't support geolocation");
}


$('.location').click(function(){
  navigator.geolocation.getCurrentPosition(setPosition, showError);
})


//Forecast 5 day / 3 hours weather
function forecast(location, cityName) {

  let api2 = `https://api.openweathermap.org/data/2.5/${location}&appid=e520e248b2ce5d233b45cf74840ed29c&units=metric`;
  fetch(api2).then(function (response) {

      let data2 = response.json();
      return data2;
    })
    .then(function (data2) {
      let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let k = data2.list.length;
      $('.location-header').html(`Forecast 5day / every 3 hours for: ${cityName}`);
      $('.weather-container').html('');
      for (let i = 0; i < k; i++) {
        let currentDay,prevDay;
        let currentData = data2.list[i].dt_txt;
        let newData = new Date(currentData);
        let currentMonthDay = newData.getDate();
        let dayName = days[newData.getDay()];
        let hours = newData.getHours();
        let minutes = newData.getMinutes()+"0";
        let currentMonth = newData.getMonth() + 1;


        let info = data2.list[i].weather[0].main;
        let idIcon = data2.list[i].weather[0].icon;
        let temp = Math.round(data2.list[i].main.temp);


        
        if (i == 0) {
          currentDay = new Date(data2.list[i].dt_txt).getDay()
          prevDay = new Date(data2.list[i].dt_txt).getDay()
        } else {
         currentDay = new Date(data2.list[i].dt_txt).getDay()
          prevDay = new Date(data2.list[i - 1].dt_txt).getDay()
        }

        if (i == 0) {
          $('.week-list').html(`
          <div class='col-2 py-3 day-wrapper' data-name='${dayName}'>${dayName}</div>`);
          $('.weather-container').append(
            `<div id="${currentDay}"  data-day='${dayName}' class="forecast-row row">
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
          $('.week-list').append(`
          <div class='col-2 py-3 day-wrapper' data-name='${dayName}'>${dayName}</div>`);
          $('.weather-container').append(
            `<div id="${currentDay}" data-day='${dayName}' class="forecast-row row hide"> 
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
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
 
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

  api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=metric`;
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

$('.week-list').on('click','.day-wrapper', function(e){
  
  let day = $(this).attr('data-name');
  $(`.forecast-row[data-day]`).addClass('hide');
  $(`.forecast-row[data-day='${day}']`).removeClass('hide');
  $(`.forecast-row[data-day='${day}']`).addClass('animation');
 
})
});

