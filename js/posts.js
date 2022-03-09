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

			<span id="date">${blogPost.date.slice(0, 10)} ${blogPost.date.slice(
      11,
      16
    )}</span>
			<div id="tags">Tags:${blogPost.tags}</div>
			
			</li>
		`;

    // ${hideEmptyArr(blogPost.tags)}

    //function for hiding the div if the array is empty or first index pos is null

    /*   async function hideEmptyArr(array) {
      if (array.length === 0 || array[0] === null) {
        console.log("array has 0 elements");
        document.querySelector("#tags").style.display = "none";
      } else {
        console.log("the array has atleast one or more elements");
      }
    } */
  });
  //posts the output tot he site in the ul
  $("#post-list").html(output);
}
