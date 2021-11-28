// Function for getting weather api
let weather = {
  apiKey: "02c0cbc4e1c48f64d42724bbeeabbf59",
  getWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      this.apiKey
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var previousSearch = JSON.parse(localStorage.getItem("WeatherAPI")) || []
        previousSearch.push(city);
        localStorage.setItem("WeatherAPI", JSON.stringify(previousSearch));
        this.searchHistory();
        this.showWeather(data)
      });
  },


  fiveDayForcast: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&&units=imperial&appid=${this.apiKey}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => this.showFiveDayForcast(data));

  },

  // Function for showing weather data from api and searches
  showWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    document.getElementById("city").innerText = "Weather in " + name;
    document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.getElementById("description").innerText = description;
    document.getElementById("temp").innerText = temp + "°F";
    document.getElementById("humidity").innerText = "Humidity: " + humidity + "%";
    document.getElementById("wind").innerText = "Wind speed: " + speed + " mph";
    document.getElementById("search-bar").value = "";
    this.fiveDayForcast(lat, lon)
  },
  search: function () {
    this.getWeather(document.getElementById("search-bar").value);
  },
  showFiveDayForcast: function (data) {
    console.log(data)
    const forecastTwo = data.daily;
    let forecastOne = "";
    for (let i = 1; i < 6; i++) {
      forecastOne += `
      <div class="card m-2 p-4" style="width: 18rem;">
  <img src="https://openweathermap.org/img/wn/${forecastTwo[i].weather[0].icon}.png" alt="...">
  <div class="card-body">
    <h5 class="card-title">Temp: ${forecastTwo[i].temp.day + '°F'}</h5>
    <p class="card-text">Humidity: ${forecastTwo[i].humidity}</p>
    <p class="card-text">Pressure: ${forecastTwo[i].pressure}</p>
    <p class="card-text">Wind Speed: ${forecastTwo[i].wind_speed}</p>
    <p class="card-text">UVI: ${forecastTwo[i].uvi}</p>
  </div>
</div>`
    }
    document.getElementById("forecasts").innerHTML = forecastOne
  },
  searchHistory: function () {
    var previousSearch = JSON.parse(localStorage.getItem("WeatherAPI")) || []
    var htmlCode = ""
    for (let i = 0; i < previousSearch.length; i++) {
      htmlCode += `<li><button class="previousSearch>${previousSearch[i]}</button></li>`
    }
    document.getElementById("history").innerHTML = htmlCode;
  }
};



document.getElementById("searchButton").addEventListener("click", function () {
  weather.search();
});

document.getElementById("search-bar").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    weather.search();
  }
});



// default query
weather.getWeather("");