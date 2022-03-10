window.onload = function () {
  readMore();
};

async function readMore() {
  const urlParams = new URLSearchParams(window.location.search);
  const response = await fetch(
    `http://localhost:5000/posts/${urlParams.get("id")}`
  );
  const post = await response.json();

  $("#main-content").html(
    `
    <div id="grid-container">
      <div id="blogPost">
        <h2 class="post-title">${post.title}</h2>
        <span id="author">By: ${post.author}</span>
        <p class="post-content">${post.content}</p>
        <div id="tags">
          Published: ${post.date.slice(0, 10)} ${post.date.slice(11, 16)} <br>
          Tags: ${showTagsCapitalizeAddSpace(post.tags)}
      </div>
    </div>
      <aside id="sidebar">
        <h2>About us</h2>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti, nostrum?</p>
        <h3>Latest posts</h3>
      </aside>
    </div>
		`
  );
}
/* 
async function gettingPosts() {
  const response = await fetch("http://localhost:5000/posts/");
  const posts = await response.json();
  let postList = "";

  for (let i = 0; i < 5; i++) {
    postList += `
    
    <li>${posts[i].title}</li>
    
    `;
  }
  console.log(postList);
}

gettingPosts(); */

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
