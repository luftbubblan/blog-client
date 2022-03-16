"use strict";

window.onload = () => fetchHandleData();

function fetchHandleData() {
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
      const imgObject = JSON.parse(data[1].image);

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
          <img class="post-img" src="${imgObject.urls.small}" alt="${
        imgObject.alt_description
      }"><br>
      <p class="post-content" type="text"></p>
      <span id="author">By: ${data[1].author}</span><br>
          <div>
           
            Published: ${data[1].date.slice(0, 10)} ${data[1].date.slice(
        11,
        16
      )} <br>
      ${showTagsCapitalizeAddSpace(data[1].tags)}
        </div>
      </div>
        <aside id="sidebar">
          <h2>About us</h2>
          <img src="https://images.unsplash.com/photo-1438109382753-8368e7e1e7cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")" width="280px">
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

      document.querySelector(".post-content").innerText = data[1].content;
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
    return `
			Tags: 
			${array.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(", ")}
		`;
  } else {
    return "";
  }
}
