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

  $("body").html(
    `
            <a href="index.html">Home</a>
            <span>/</span>
            <a href="/admin/admin.html">Admin</a>
			<h2>${post.title}</h2>
			
			<span id="author">${post.author}</span>
		
			<p>${post.content}</p>

			<span id="date">${post.date.slice(0, 10)} ${post.date.slice(11, 16)}</span>
			<div id="tags">Tags:${post.tags}</div>
		`
  );
}
