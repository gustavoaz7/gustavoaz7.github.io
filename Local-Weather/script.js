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
  'Thunderstorm': ['wi-thunderstorm', 'http://cdn.wallpapersafari.com/77/14/gq0rz6.jpg'],
  'Drizzle': ['wi-sprinkle', 'https://images5.alphacoders.com/403/403926.jpg'],
  'Rain': ['wi-rain', 'http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-drops-of-rain-from-sky-weather.jpg'],
  'Snow': ['wi-snow', 'http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-snowing-in-the-trees-weather.jpg'],
  'Atmosphere': ['wi-dust', 'https://i.pinimg.com/originals/79/5e/08/795e08ccde3b67f80119597d74fde0b1.jpg'],
  '800': [['wi-day-sunny', 'https://sheridantower.files.wordpress.com/2012/05/clear-sky7.jpg'], ['wi-night-clear', 'https://www.walldevil.com/wallpapers/a57/sky-moon-night-star.jpg']],
    // fc = few clouds
  '8xx': {'fc': [['wi-day-cloudy', 'http://wpnature.com/wp-content/uploads/2017/04/natural-force-storm-sun-rays-new-york-rochester-clouds-beforethestorm-wallpaper-hd-1920x1080.jpg'], ['wi-night-alt-cloudy', 'http://eskipaper.com/images/night-clouds-moon-1.jpg']], 'other': ['wi-cloudy', 'http://www.footwa.com/wp-content/uploads/2010/05/Solitary-bird-in-the-sky.jpg']},
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
          `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&APPID=${key}`;
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

        // Getting 5 Day Forecast
        let forecastURL = 
          `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&APPID=${key}`;
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

/*
const weather = {
  'Thunderstorm': ['wi-thunderstorm', 'url'],
  'Drizzle': ['wi-sprinkle', 'url'],
  'Rain': ['wi-rain', 'url'],
  'Snow': ['wi-snow', 'url'],
  'Atmosphere': ['wi-dust', 'url'],
  '800': [['wi-day-sunny', 'url'], ['wi-night-clear', 'url']],
  '8xx': {'fc': [['wi-day-cloudy', 'url'], ['wi-night-alt-cloudy', 'url']], 'other': ['wi-cloudy', 'url']},
  'xxx': ['wi-na', 'url']
}

THUNDERSTORM
https://www.pixelstalk.net/wp-content/uploads/2016/08/Lightning-Storm-Background-Download-Free.jpg
https://www.pixelstalk.net/wp-content/uploads/2016/08/Blue-Lightning-Storm-Background.jpg
http://vunature.com/wp-content/uploads/2016/10/sky-lightning-nature-clouds-storm-rain-thunderstorm-hd-1920x1080-1920x1080.jpg
* http://cdn.wallpapersafari.com/77/14/gq0rz6.jpg
http://mmbiz.qpic.cn/mmbiz/9MjD2VejKrn5OPxOhicp2bL0jePBxGpoyAaIVl23bZMX8CfzEqwiag75sVhGypejrlDhvwdnW74Jdc4kP4O78LIw/0?wx_fmt=jpeg
http://wtop.com/wp-content/uploads/2014/07/355929-1865x1254.jpg


    DRIZZLE
    https://get.pxhere.com/photo/water-nature-drop-sunset-night-texture-rain-window-reflection-macro-weather-closeup-clouds-drops-drops-of-water-the-background-dark-clouds-rain-drops-pane-after-the-storm-drop-of-rain-893238.jpg
    * https://images5.alphacoders.com/403/403926.jpg
    http://orig06.deviantart.net/b6f6/f/2012/233/5/6/rainy_wallpaper_by_moggget-d5bwqju.jpg

RAIN
https://graphiccloud.net/wp-content/uploads/2016/04/rain-blue-drop-background.jpg
http://cdn.wallpapersafari.com/16/94/oa3LSD.jpg
https://i.ytimg.com/vi/HopSpWYmVso/maxresdefault.jpg
* http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-drops-of-rain-from-sky-weather.jpg
http://www.weatherwizkids.com/wp-content/uploads/2015/02/rain21.jpg

    SNOW
    http://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/10/16/uk-snow-getty.jpg
    * http://www.wallpaperawesome.com/wallpapers-awesome/wallpapers-weather-clouds-tornado-rain-cyclone-flashlights-awesome/wallpaper-snowing-in-the-trees-weather.jpg
    http://99px.ru/sstorage/53/2016/02/tmb_157247_6142.jpg

    MIST
    * http://cdn.wallpapersafari.com/5/85/z30Ag8.jpg
    https://i.pinimg.com/originals/79/5e/08/795e08ccde3b67f80119597d74fde0b1.jpg

    CLEAR SKY
        DAY
    http://cdn.wallpapersafari.com/36/71/xzgvI2.jpg
    https://i.ytimg.com/vi/WdcuOC3oyhk/maxresdefault.jpg
    https://balancebox.files.wordpress.com/2012/04/dsc_0494-edit.jpg
    https://www.walldevil.com/wallpapers/a83/sun-sky-cloud-field-tree.jpg
    * https://sheridantower.files.wordpress.com/2012/05/clear-sky7.jpg
    https://static.squarespace.com/static/53bd3460e4b07d8e4ad42994/t/53d05575e4b0b1c1fde219b1/1406162293119/wallpapers-sky-clear-grasslands-hd-1280x800.jpg

        NIGHT
    * https://www.walldevil.com/wallpapers/a57/sky-moon-night-star.jpg
    http://natbg.com/wp-content/uploads/2016/06/sky-bright-glowing-moon-ocean-night-clear-sky-nature-trees-shore-desktop-background-images.jpg
    http://cdnau.ibtimes.com/sites/au.ibtimes.com/files/2015/12/11/full-moon-rises-above-graveney-kent-clear-autumn-evening-night-descends-britain-october-26-2015.jpg
    https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/moon-and-misty-night-sky_zjkrmh3gs__F0000.png
    https://static.pexels.com/photos/8170/sky-clouds-trees-moon.jpg


    CLOUDY
        DAY
    * http://wpnature.com/wp-content/uploads/2017/04/natural-force-storm-sun-rays-new-york-rochester-clouds-beforethestorm-wallpaper-hd-1920x1080.jpg
    https://wallpaperscraft.com/image/clouds_sky_sun_beams_day_26843_1600x1200.jpg
    http://renatures.com/wp-content/uploads/2017/03/sky-gold-cool-beautiful-brown-blue-nice-morning-day-awesome-orange-clouds-sunset-amazing-afternoon-black-nature-white-sun-beauty-forces-sunlight-ipad-wallpaper-night-1600x1080.jpg

        NIGHT
    * http://eskipaper.com/images/night-clouds-moon-1.jpg
    http://8-themes.com/wp-content/uploads/2015/12/Space_Moon_among_the_night_clouds_094737_.jpg
    https://i.pinimg.com/originals/c7/31/73/c731730ed01a1f35c9c5cee252e3180c.jpg
    https://curiousvogel.files.wordpress.com/2014/07/07132009.jpg


        TOTAL
    http://www.patternpictures.com/wp-content/uploads/2013/12/PP58062412-Radiant-Cloudy-Sky-over-Sea-Water.jpg
    * http://www.footwa.com/wp-content/uploads/2010/05/Solitary-bird-in-the-sky.jpg
    http://cdn.wallpapersafari.com/47/67/kN7Vzv.jpg







*/