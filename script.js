
const userlocation = document.getElementById("userlocation");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("CValue");
const UVValue = document.getElementById("UVValue");
const PValue = document.getElementById("PValue");
const forecast = document.getElementById("forecast");

const API_KEY = "a5bb4718b30b6f58f58697997567fffa";

const CURRENT_API = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;
const FORECAST_API = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&q=`;

function findUserLocation() {
  const location = userlocation.value.trim();
  if (!location) return alert("Please enter a location.");

  forecast.innerHTML = "";

  fetch(CURRENT_API + location)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) throw new Error(data.message);

      console.log("Current Weather:", data);

      city.innerHTML = `${data.name}, ${data.sys.country}`;
      weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
      temperature.innerHTML = `${TempConverter(data.main.temp)}`;
      feelslike.innerHTML = `Feels like: ${TempConverter(data.main.feels_like)}`;
      description.innerHTML = `<i class="fa-solid fa-cloud"></i> ${data.weather[0].description}`;

      const dt = new Date((data.dt + data.timezone) * 1000);
      date.innerHTML = dt.toLocaleString();

      HValue.innerHTML = data.main.humidity + "%";
      WValue.innerHTML = data.wind.speed + " km/h";
      CValue.innerHTML = data.clouds.all + "%";
      PValue.innerHTML = data.main.pressure + " hPa";
      UVValue.innerHTML = "--"; // Not available in this API
      SRValue.innerHTML = formatTime(data.sys.sunrise + data.timezone);
      SSValue.innerHTML = formatTime(data.sys.sunset + data.timezone);

      return fetch(FORECAST_API + location);
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Forecast Data:", data);

      const days = {};

      data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = [];
        days[date].push(item);
      });

      Object.keys(days).forEach((day, index) => {
        if (index === 0) return; // skip today

        const items = days[day];
        const icon = items[0].weather[0].icon;
        const desc = items[0].weather[0].description;

        const temps = items.map((i) => i.main.temp);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        const div = document.createElement("div");
        div.innerHTML = `
          <p>${formatDate(day)}</p>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}"/>
          <p class="forecast-desc">${desc}</p>
          <span><span>${TempConverter(minTemp)}</span>&nbsp;&nbsp;<span>${TempConverter(maxTemp)}</span></span>
        `;
        forecast.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to fetch weather data. Please try again.");
    });
}

function TempConverter(temp) {
  const tempValue = Math.round(temp);
  if (converter.value === "°C") {
    return `${tempValue}<span>°C</span>`;
  } else {
    const fahrenheit = Math.round((tempValue * 9) / 5 + 32);
    return `${fahrenheit}<span>°F</span>`;
  }
}

function formatTime(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

document.getElementById("search").addEventListener("click", findUserLocation);

data.daily.slice(1, 6).forEach((weather) => {
  let div = document.createElement("div");
  div.classList.add("forecast-card");

  const dailyOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  let dailyDate = getLongFormatDateTime(weather.dt, data.timezone_offset, dailyOptions);

  div.innerHTML = `
    <h4>${dailyDate}</h4>
    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" />
    <p class="forecast-desc">${weather.weather[0].description}</p>
    <span><strong>${TempConverter(weather.temp.min)}</strong> / <strong>${TempConverter(weather.temp.max)}</strong></span>
  `;

  forecast.appendChild(div);
});


// Load default city on start
fetchWeather("Lagos");