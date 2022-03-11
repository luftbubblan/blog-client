window.onload = function () {
  	fetchAllPosts();
};

async function fetchAllPosts() {
	try {
		const response = await fetch("http://localhost:5000/posts/");
		const posts = await response.json();
		posts.reverse();
	
		const authors = await fetch('admin/authors.txt');
		const authorsText = await authors.text();
		const approvedAuthors = authorsText.split(",");
	
		let output = "";
	
		//iterates all posts and creates the html for them
		$.each(posts, function (key, post) {
			if (trueAuthor(post.author, approvedAuthors)) {
				//removes all . from the back of the string
				while (post.content[post.content.length-1] === ".")
				post.content = post.content.slice(0,-1);

				//if over 100 leters show only 100 and add ...
				if(post.content.length > 100) {
					post.content = post.content.slice(0, 100) + "...";

				//else show all
				} else {
					post.content = post.content;
				}

				//creates the output
				output += `
					<li class="post" data-id="${post._id}">
						<h2>${post.title}</h2>
		
						<span id="author">By: <i>${post.author}</i></span>
		
						<p>
							${post.content}<br>
							<a href="post.html?id=${post._id}">Show Post</a>		
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