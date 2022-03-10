window.onload = function () {
  readMore();
};

async function readMore() {
  const urlParams = new URLSearchParams(window.location.search);
  const response = await fetch(
    `http://localhost:5000/posts/${urlParams.get("id")}`
  );
  const post = await response.json();
  console.log(post);

  $("#main-content").html(
    `
			<h2>${post.title}</h2>
			
			<span id="author">Author: ${post.author}</span>
		
			<p>${post.content}</p>

			<span id="date">${post.date.slice(0, 10)} ${post.date.slice(11, 16)}</span>
			<div id="tags">Tags:${post.tags}</div>
		`
  );
}
