// Your SwiftFeed JavaScript code goes here

$(document).ready(function () {
  let tweets = [];
  const tweetIds = new Set();
  let paused = false;

  $('#btn').click(function () {
    paused = !paused;
  });

  function requestTweets(url, callback) {
    $.get(url, callback);
  }

  function tweetHandler(data, status) {
    if (status === "success") {
        // do something with data

        const newTweets = data.filter(tweet => {
          return !tweetIds.has(tweet.id)
        });

        newTweets.forEach(tweet => {
          tweetIds.add(tweet.id);
          tweets.push(tweet);
          $('#head').after(`
          <div class="tweet">
            <img src="${tweet.user.profile_image_url}" />
            <h4>${tweet.user.name}</h4>
            <p>${tweet.text}</p>
          <div>`);
          if (tweets.length > 26) {
            $('#tail').prev().remove();
          }
        });

    } else {
        // something went wrong, check status
        console.error(data);
    }
  }

  requestTweets('http://ec2-18-218-249-183.us-east-2.compute.amazonaws.com/feed/start', tweetHandler);

  setInterval(function () {
    if (!paused) {
      requestTweets('http://ec2-18-218-249-183.us-east-2.compute.amazonaws.com/feed/start', tweetHandler);
    }
  }, 5000);
})

