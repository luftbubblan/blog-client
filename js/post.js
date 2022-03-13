"use strict";

window.onload = () => fetchAndHandelData();

function fetchAndHandelData() {
  const urlParams = new URLSearchParams(window.location.search);
  Promise.all([
    fetch("http://localhost:5000/posts/"),
    fetch(`http://localhost:5000/posts/${urlParams.get("id")}`),
  ])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          return response.json();
        })
      );
    })
    .then((data) => {
      const filterByOurAuthores = data[0].filter((element) => {
        return (
          element.author === "Malin" ||
          element.author === "Anna" ||
          element.author === "Oscar" ||
          element.author === "Luftbubblan" ||
          element.author === "Jonathan"
        );
      });

      filterByOurAuthores.reverse();

      let postList = "";
      let counter = 0;
      for (let post of filterByOurAuthores) {
        counter++;
        if (counter === 6) {
          break;
        } else {
          postList += `
        <li><a href="post.html?id=${post._id}">${post.title}</a> by <i>${post.author}</i></li>
        `;
        }
      }

      document.querySelector("#main-content").innerHTML = `
      <div id="grid-container">
        <div id="blogPost">
          <h2 class="post-title">${data[1].title}</h2>
          <span id="author">By: ${data[1].author}</span><br>
          <p class="post-content">${data[1].content}</p>
          <div id="tags">
            Tags: ${showTagsCapitalizeAddSpace(data[1].tags)}<br>
            Published: ${data[1].date.slice(0, 10)} ${data[1].date.slice(
        11,
        16
      )}
        </div>
      </div>
        <aside id="sidebar">
          <h2>About us</h2>
          <img src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2352&q=80")" width="190px" height="160px">
          <p>The Gardening Blog is THE place for everything garderning!</p>
          <div>
            <h3>Latest posts</h3>
            <ul>
            ${postList}
            </ul>
          </div>
        </aside>
      </div>
      `;
    })
    .catch((error) => {
      console.log(error);
      document.querySelector(
        ".error"
      ).innerHTML = `Error: (${error}). Try again!`;
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
