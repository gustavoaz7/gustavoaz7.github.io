const userIDs = ["ESL_SC2", 'c9shroud', 'LIRIK', 'summit1g', "OgamingSC2", "cretetion", "freecodecamp", 
  "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", 'garenatw', 'silvername', 'nooneboss'];
const key = '6uwh8hhynrxszcavv8ksp03v0dj5iq';
let users = [];  // Array of objects(channels)
const filters = document.querySelectorAll('#head>li');
const update = document.querySelector('#update');
const list = document.querySelector('#list');

// Fetching channel list from server on page load
getChannels();

// Filtering list of channels 
filters.forEach(li => li.addEventListener('click', function () {
  // Styling filter button
  filters.forEach(l=>l.classList.remove('active'));
  li.classList.add('active');
  // Filtering list
  li.id === 'on' ? populateList(users.filter(user => user.online)) :
  li.id === 'off' ? populateList(users.filter(user => !user.online)) : populateList(users);
}))


function populateList (array) {
  // Cleaning list before populating it
  while (list.firstChild) {list.removeChild(list.firstChild)};
  // Inserting each channel with its informations
  for (let i = 0; i < array.length; i++) {
  list.innerHTML += `
<a href="${array[i].url}" target="_blank">
<div>
<img class="logoimg" src="${array[i].logo}" alt="logo">
<h3>${array[i].name}</h3>
<span>${array[i].online ? 'Online' : 'Offline'}</span>
<p id="game">${array[i].game || ""}</p>
<p id="lang">Lang: ${array[i].language || '-'}</p>
</div>
</a>`;
  }
  // Styling text and background if online/offline
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent === 'Online') {
      span.style.color = 'green';
      span.parentElement.style.background = 'rgba(135, 211, 124, 0.3)';
    } else if (span.textContent === 'Offline') {
      span.style.color = 'red';
      span.parentElement.style.background = 'rgba(236,100,75, 0.2)';
    }
  })
}


function getChannels() {
  userIDs.map((id, i) => {
    let URL = `https://api.twitch.tv/kraken/streams/${id}?client_id=${key}`;
    fetch(URL).then(response => response.json())
    .then(data => {
      if (data.stream === null) {
        users[i] = {
          name: userIDs[i],
          online: false,
          logo: 'http://www.offworldgames.com/wp-content/uploads/2015/07/twitch.jpeg',
          url: 'https://www.twitch.tv/'
        }
      } else {
        users[i] = {
          name: userIDs[i],
          online: true,
          game: data.stream.channel.game,
          language: data.stream.channel.language.toUpperCase(),
          logo: data.stream.channel.logo,
          url: data.stream.channel.url
        }
      }
      return users;
    })
    .then(users => populateList(users))
  }); 
}