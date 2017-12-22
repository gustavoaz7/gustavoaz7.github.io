
var quoteMsge = $('#generator')
let quoteStyle = document.querySelectorAll('.fa-quote-left');
let twitter = document.getElementById('twitter');

$(document).ready(function() {
  quoteMsge.click(function () {
    $.ajax({
			url: "https://api.forismatic.com/api/1.0/",
			jsonp: "jsonp",
			dataType: "jsonp",
			data: {
				method: "getQuote",
				lang: "en",
				format: "jsonp"
			},
			success: function(quote) {
				$("#quote").text(quote.quoteText);
				$("#author").text(quote.quoteAuthor || 'Anonymmous');
				let tweet = quote.quoteText+"\nBy: "+ (quote.quoteAuthor || 'Anonymous');
				$('#twitter').attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet));  
				if (tweet.length > 140) {
					twitter.addEventListener('click', (e) => {
						alert('Tweet is not possible. This quote is over 140 characters.'); 
						e.preventDefault()
						}, {once: true});
				};
        quoteStyle.forEach(x => x.style.visibility = 'visible')
			}
    });
  });
});

