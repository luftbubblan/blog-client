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

  $("#blogPost").html(
    `
			<h2 class="post-title">${post.title}</h2>
			
			<span id="author">By: ${post.author}</span>
		
			<p class="post-content">${post.content}</p>

			<div id="tags">
        Published: ${post.date.slice(0, 10)} ${post.date.slice(11, 16)} <br>
        Tags: ${showTagsCapitalizeAddSpace(post.tags)}
      </div>
		`
  );
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
