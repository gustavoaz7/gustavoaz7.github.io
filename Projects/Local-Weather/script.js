const city = document.querySelector('.city');
const country = document.querySelector('.country')
const hour = document.querySelector('.hour')
const week = document.querySelector('.week')
const current = document.querySelector('.current')
const weatherIcon = document.querySelector('.weather > i')
const tempNow = document.querySelector('.tempNow')
const tempMaxMin = document.querySelector('.tempMaxMin')
const humidity = document.querySelector('.humidity')
const cloudyness = document.querySelector('.cloudyness')
const wind = document.querySelector('.wind')
const forecast = document.querySelector('.forecast')

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// [iconClass, URL]
const weather = {
  'Thunderstorm': ['wi-thunderstorm', './img/thunderstorm.jpg'],
  'Drizzle': ['wi-sprinkle', './img/drizzle.jpg'],
  'Rain': ['wi-rain', './img/rain.jpg'],
  'Snow': ['wi-snow', './img/snow.jpg'],
  'Atmosphere': ['wi-dust', './img/atmosphere.jpg'],
  '800': [['wi-day-sunny', './img/sunny.jpg'], ['wi-night-clear', './img/night.jpg']],
    // fc = few clouds
  '8xx': {'fc': [['wi-day-cloudy', './img/cloudy-day.jpg'], ['wi-night-alt-cloudy', './img/cloudy-night.jpg']], 'other': ['wi-cloudy', './img/cloudy.jpg']},
  'xxx': ['wi-na', 'url']
}

// Updating clocks curent time
setInterval(function() {
  let now = new Date();
  hour.innerHTML = `${now.toString().split(" ")[4].slice(0,5)}`;
  let month = now.getMonth()+1;
  let day = now.getDate();
  if ((day+"").length === 1) {day = `0${day}`}
  if ((month+"").length === 1) {month = `0${month}`};
  week.innerHTML = `${now.toString().split(" ")[0]} ${day}/${month}`;
}, 1000);

// Display Current Weather x 5 Day Forecast
const btn = document.querySelector('.btn')
const btnF = document.querySelector('.btnForecast')
const btnC = document.querySelector('.btnCurrent')
let logic = true;
btn.addEventListener('click', function (e) {
  if (logic) {
    current.classList.add('active');
    forecast.classList.add('active');
    btnF.style.display = `none`;
    btnC.style.display = `inline-block`;
  } else {
    current.classList.remove('active');
    forecast.classList.remove('active');
    btnF.style.display = `inline-block`;
    btnC.style.display = `none`;
  }
  logic = !logic;
});

// Changing units by new request with different units to the server
  // Would it be better to create global variables for all values and change them with
  // celsiusToFahrenheit and KMHtoMPH functions ?
const metric = document.querySelector('.metric');
let celsius = true;
metric.addEventListener('click', function(e) {
  if (celsius) {
    units = 'imperial';
    metric.style.background = `linear-gradient(to left, rgba(255,255,255,0.8) 50%, transparent 50%)`;
    getAllData();
  } else {
    units = 'metric';
    metric.style.background = `linear-gradient(to right, rgba(255,255,255,0.8) 50%, transparent 50%)`;
    getAllData()
  }
  celsius = !celsius;
})

// Getting Geolocation
const key = '89232155a28e10f6f080b65258157ece';
const geoURL = 'https://freegeoip.net/json/';
let units = 'metric';
let lat, lon;
function getAllData(){
  fetch(geoURL)
    .then(response => response.json())
      .then(data => {
        lat = data.latitude;
        lon = data.longitude;
        city.innerHTML = data.city;
        country.innerHTML = `${data.region_code}, ${data.country_name}`;

        // Getting Weather Information
        const weatherURL = 
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&APPID=${key}`;
        return fetch(weatherURL);
      })
    .then(response => response.json())
      .then(data => {
        tempNow.innerHTML  = `<p>${data.main.temp.toFixed(1)}</p>`;
        tempMaxMin.innerHTML = `<p><i class="wi wi-thermometer"></i> ${parseInt(data.main.temp_max)}<i 
          class="wi wi-degrees"></p></i>  <p><i class="wi wi-thermometer-exterior"></i>
          ${parseInt(data.main.temp_min)}<i class="wi wi-degrees"></i></p>`;
        humidity.innerHTML = `${data.main.humidity}%`;
        cloudyness.innerHTML = `${data.clouds.all}%`;
        if (units === 'metric') {
          tempNow.innerHTML += `<i class="wi wi-celsius"></i>`;
          wind.innerHTML = `${(data.wind.speed*3.6).toFixed(1)} km/h`;
        } else {
          tempNow.innerHTML += `<i class="wi wi-fahrenheit"></i>`;
          wind.innerHTML = `${(data.wind.speed).toFixed(1)} mph`;
        }
        
        // Selecting icon and Background according to the weather
        let main = data.weather[0].main;
        let id = data.weather[0].id;
        let icon = data.weather[0].icon;
        let descript = data.weather[0].description;
        let [i, bg] = getIconAndBackground(main, id, icon, descript);
        weatherIcon.classList.add(i);
        document.body.style.background = `url(${bg}) center no-repeat`;
        document.body.style.backgroundSize = 'cover';

        // Getting 5 Day Forecast
        let forecastURL = 
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&APPID=${key}`;
        return fetch(forecastURL);
      })
      .then(response => response.json())
        .then(data => {
          // Forecast is created on the fly. So we clean it up everytime the function is called to poppulate it again.
          while (forecast.firstChild) { forecast.removeChild(forecast.firstChild)};
          let now = new Date();
          let wd = now.getDay();
          for (let i = 0; i < 5; i++) {
            let div = document.createElement('div');
              div.classList.add('fore');
              div.classList.add(`f${i}`);
            let day = document.createElement('p');
              wd++;
              // Back to Sunday after 7 days
              if (wd > 6) wd -= 7;
              day.textContent = weekday[wd];
            let ico = document.createElement('i');
              // Timespan of 3h between every item in the list. (3*8 = 24) Therefore i*8
              let main = data.list[i*8].weather[0].main;
              let id = data.list[i*8].weather[0].id;
              let icon = data.list[i*8].weather[0].icon;
              let descript = data.list[i*8].weather[0].description;
              let [ic, bg] = getIconAndBackground(main, id, icon, descript);
              ico.classList.add('wi');
              ico.classList.add('sm')
              ico.classList.add(ic);
            let tem = document.createElement('span');
            div.appendChild(day);
            div.appendChild(ico);
            div.appendChild(tem);
            forecast.appendChild(div);
            document.querySelector(`.f${i} > span`).innerHTML = `<p><i class="wi wi-thermometer"></i>
              ${parseInt(data.list[i*8].main.temp_max)}<i class="wi wi-degrees"></p></i> <p><i 
              class="wi wi-thermometer-exterior"></i> ${parseInt(data.list[i*8].main.temp_min)}<i
              class="wi wi-degrees"></i></p>`;
          };

        })
};
// Getting all data when page is loaded
getAllData();

// Output format: [icon, URL]
function getIconAndBackground(main, id, icon, descript) {
  let sel;
  if (weather[main]) {return [weather[main][0], weather[main][1]];
  } else if (id === 800) {
      sel = weather[800];
      return icon.includes('d') ? [sel[0][0], sel[0][1]] : [sel[1][0], sel[1][1]];
  } else if (id < 900) {
      sel = weather['8xx'];
      return descript.includes('few clouds') ? 
        icon.includes('d') ? [sel.fc[0][0], sel.fc[0][1]] : [sel.fc[1][0], sel.fc[1][1]] :
      [sel.other[0], sel.other[1]];
  } else {return [weather.xxx[0], weather.xxx[1]];}
}
