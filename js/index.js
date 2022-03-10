window.onload = function () {
  	fetchAllPosts();
};

async function fetchAllPosts() {
	try {
		const response = await fetch("http://localhost:5000/posts/");
		const posts = await response.json();
		posts.reverse();
	
		const a = await fetch('admin/authors.txt');
		const b = await a.text();
		const approvedAuthors = b.split(",");
	
		let output = "";
	
		//iterates all posts and creates the html for them
		$.each(posts, function (key, post) {
			if (trueAuthor(post.author, approvedAuthors)) {
				output += `
					<li class="post" data-id="${post._id}">
						<h2>${post.title}</h2>
		
						<span id="author">By: <i>${post.author}</i></span>
		
						<p>
							${post.content.slice(0, 100).slice(0, -5) + "..."}
							<a href="post.html?id=${post._id}">read more</a>		
						</p>
		
						<span id="date">
							<i>${post.date.slice(0, 10)} - ${post.date.slice(11, 16)}</i>
						</span>
						${showTagsCapitalizeAddSpace(post.tags)} 
					</li>
				`;
		}
		});

		//posts the output tot he site in the ul
		$("#post-list").html(output);
	}

	catch(error) {
		console.log(error);
	}
	//function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
	function showTagsCapitalizeAddSpace(array) {
		if (array === null) {
			return "";
		} else if (array.length !== 0) {
			return `
				<div id='tags'>Tags: 
				${array.map((w) => w.charAt(0).toUpperCase()
				+ w.slice(1)).join(", ")}
			`;
		} else {
			return "";
		}
	}
}

function trueAuthor(author, approvedAuthors) {
	for (let approvedAuthor of approvedAuthors) {
		if(author === approvedAuthor) {
			return true;
		}
	}
	return false;
}