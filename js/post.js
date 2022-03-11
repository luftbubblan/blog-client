window.onload = function () {
  gettingAndHandelingData();
};

async function gettingAndHandelingData() {
  const urlParams = new URLSearchParams(window.location.search);
  Promise.all([
    fetch("http://localhost:5000/posts/"),
    fetch(`http://localhost:5000/posts/${urlParams.get("id")}`),
  ])
    .then(function (responses) {
      return Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );
    })
    .then(function (data) {
      //do something with both sets of data here

      let postList = "";

      for (let i = 0; i < 5; i++) {
        postList += `
      <a href="#"><li>${data[0][i].title}</li></a>
      `;
      }

      $("#main-content").html(
        `
      <div id="grid-container">
        <div id="blogPost">
          <h2 class="post-title">${data[1].title}</h2>
          <span id="author">By: ${data[1].author}</span>
          <p class="post-content">${data[1].content}</p>
          <div id="tags">
            Published: ${data[1].date.slice(0, 10)} ${data[1].date.slice(
          11,
          16
        )} <br>
            Tags: ${showTagsCapitalizeAddSpace(data[1].tags)}
        </div>
      </div>
        <aside id="sidebar">
          <h2>About us</h2>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti, nostrum?</p>
          <h3>Latest posts</h3>
          <ul>
          ${postList}
          </ul>
        </aside>
      </div>
      `
      );
    })
    .catch(function (error) {
      console.log(error);
    });
}

//function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
function showTagsCapitalizeAddSpace(array) {
  if (array === null) {
    return "";
  } else if (array.length !== 0) {
    return `${array
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(", ")}`;
  } else {
    return "";
  }
}
