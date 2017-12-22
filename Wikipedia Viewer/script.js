const search = document.querySelector('#search');
const results = document.querySelector('#results');


const test = document.querySelectorAll('#results>a');
test.forEach(x=>xaddEventListener('mouseover', function() {this.classList.add('active');}));

search.addEventListener('input', function () {
  console.log(this.value)
  let searched = this.value;
  let URL = `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=${searched}`;
  fetch(URL).then(response => response.json())
    .then(data => {
      while (results.firstChild) {results.removeChild(results.firstChild)}
      for (let i = 0; i < data[1].length; i++) {
        results.innerHTML += `<a href="${data[3][i]}" target="_blank"  alt="${data[1][i]}">
<div class="result"><h3>${data[1][i]}</h3>
<p>${data[2][i]}</p></div></a>`;
      }
  })
})