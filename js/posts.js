window.onload = function () {
  fetchAllBplogPosts();
};

async function fetchAllBplogPosts() {
  const response = await fetch("http://localhost:5000/posts/");
  const posts = await response.json();
  posts.reverse();
  let output = "";

  //iterates all posts and creates the html for them
  $.each(posts, function (key, blogPost) {
    output += `
			<li class="post" data-id="${blogPost._id}">

			<h2>${blogPost.title}</h2>

			
			<span id="author">By: <i>${blogPost.author}</i></span>
		
  
			<p>
				${blogPost.content.slice(0, 100).slice(0, -3) + "..."}
        <a href="post.html?id=${blogPost._id}">read more</a>
						
			</p>

			<span id="date"><i>${blogPost.date.slice(0, 10)} - ${blogPost.date.slice(
      11,
      16
    )}</i></span>
			${showTagsCapitalizeAddSpace(blogPost.tags)} 
			
			</li>
		`;

    //function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
    function showTagsCapitalizeAddSpace(array) {
      if (array === null) {
        return "";
      } else if (array.length !== 0) {
        return `<div id='tags'>Tags: ${array
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(", ")}`;
      } else {
        return "";
      }
    }
  });

  //posts the output tot he site in the ul
  $("#post-list").html(output);
}
