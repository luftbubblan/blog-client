window.onload = function () {
  fetchAllBplogPosts();
};

async function fetchAllBplogPosts() {
  const response = await fetch("http://localhost:5000/posts/");
  const posts = await response.json();
  console.log(posts);
  let output = "";

  //iterates all posts and creates the html for them
  $.each(posts, function (key, blogPost) {
    output += `
			<li class="post" data-id="${blogPost._id}">

			<h2>${blogPost.title}</h2>

			
			<span id="author">${blogPost.author}</span>
		
  
			<p>
				${blogPost.content.slice(0, 100)}
				<a href="post.html?id=${blogPost._id}">Read more</a>
						
			</p>

			<span id="date">${blogPost.date.slice(0, 10)} ${blogPost.date.slice(11, 16)}</span>
			${showTags(blogPost.tags)}
			
			</li>
		`;

    //function for hiding the div if the array is empty or first index pos is null

		function showTags(array) {
			if (array === null) {
				console.log("array is null");
				return "";
			} else if (array.length !== 0) {
				 console.log("the array has atleast one or more elements");
				return `<div id='tags'>Tags:${array}</div>`;
			} else {
				return "";
			}
		}
  });
  //posts the output tot he site in the ul
  $("#post-list").html(output);
}
