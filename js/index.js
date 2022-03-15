window.onload = function () {
  fetchAllPosts();
};

async function fetchAllPosts() {
  try {
    const response = await fetch("http://localhost:5000/posts/");
    const posts = await response.json();
    posts.reverse();

    const authors = await fetch("admin/authors.txt");
    const authorsText = await authors.text();
    const approvedAuthors = authorsText.split(",");

	let topOutput = "";
	let topPostNotPrinted = true;
	
	// appends the first (latest) post to the top, only shows the 2000 first letters, adds ... if more than 2000
	while(topPostNotPrinted) {
		$.each(posts, function (key, post) {
			if (trueAuthor(post.author, approvedAuthors)) {
				const img = JSON.parse(post.image)
				//removes all . from the back of the string
				while (post.content[post.content.length - 1] === ".") {
					post.content = post.content.slice(0, -1);
				}

				//if over 2000 leters show only 2000 and add ...
				let showReadMoreTopPost = false;
				if (post.content.length > 2000) {
					post.content = post.content.slice(0, 2000) + "...";
					showReadMoreTopPost = true;
				}
				topOutput = (`
				<li class="top-post" data-id="${post._id}">
					<a href="post.html?id=${post._id}"><h2 id="title"></h2></a>
					
					<div id="author">
						By: <i>${post.author}</i>
					</div>
						
					<p id="content" type="text"></p>
					<a href="post.html?id=${post._id}" id="readMoreTopPost"></a>
					

					<img src="${img.urls.small}" alt="${img.alt_description}">

					<div id="date">
						<i>${post.date.slice(0, 10)} - ${post.date.slice(11, 16)}</i>
					</div>
					${showTagsCapitalizeAddSpace(post.tags)}
				</li>
				`)
				$('#top-post').append(topOutput);
				$('#title').text(post.title);
				$('#content').text(post.content);
				if(showReadMoreTopPost) {
					$('#readMoreTopPost').append('Read more');
				}
				topPostNotPrinted = false;
				return false;
			}
		});
		topPostNotPrinted = false;
	}
	
	let output = [];

    //iterates all posts except the first one and creates the html for them
    $.each(posts, function (key, post) {
      	if (trueAuthor(post.author, approvedAuthors)) {
			const img = JSON.parse(post.image)
			//removes all . from the back of the string
			while (post.content[post.content.length - 1] === ".") {
				post.content = post.content.slice(0, -1);
			}

			//if over 100 leters show only 100 and add ...
			if (post.content.length > 100) {
				post.content = post.content.slice(0, 100) + "...";
			}
			
			//creates the output without the first post
			output.push(`
			<li class="post" data-id="${post._id}">
				<div class="leftSideOfPost">
					<img src="${img.urls.small}" alt="${img.alt_description}">
				</div>
				
				<div class="rightSideOfPost">
					<a href="post.html?id=${post._id}"><h2>${post.title}</h2></a>
					
					<span class="author">By: <i>${post.author}</i></span>
					
					<p>${post.content}</p>
					<a href="post.html?id=${post._id}" id="readMore${post._id}" class="readMore"></a>
					
					<div class="dateAndTags">
						<i>${post.date.slice(0, 10)} - ${post.date.slice(11, 16)}</i>
						${showTagsCapitalizeAddSpace(post.tags)}
					</div>
				</div>
			</li>
			`);
		}
    })
	
    let i = 1;
    let j = 6;
    //posts the 6 latest posts to he site in the ul
    for (; i < j; i++) {
		$("#post-list").append(output[i]);
    }

	// show read more text on posts with more than 100 letters
	$.each(posts, function (key, post) {
		if (trueAuthor(post.author, approvedAuthors)) {
			if (post.content.length > 100) {
				$(`#readMore${post._id}`).append('Read more');
			}
		}
	})

    //if all posts are loaded(less then 6) show message otherwise show load more link
    if (output.length <= 6) {
      	$("#allPostsLoaded").removeAttr('hidden');
    } else {
		$("#loadMorePosts").removeAttr('hidden');
    }
	
    //on click load 5 more posts or show that there are no more posts to load
    $("#loadMorePosts").click(function () {
		j += 5;
		for (; i < j; i++) {
			$("#post-list").append(output[i]);
		}
		if (output.length == $("li").length) {
			$("#allPostsLoaded").removeAttr('hidden');
			$("#loadMorePosts").attr("hidden", "true");
      }
    });

 	} catch (error) {
    	console.log(error);
  	}
}

//function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
function showTagsCapitalizeAddSpace(array) {
  if (array === null) {
    return "";
  } else if (array.length !== 0) {
    return `
			<div id='tags'>Tags: 
			${array.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(", ")}
		`;
  } else {
    return "";
  }
}

function trueAuthor(author, approvedAuthors) {
  for (let approvedAuthor of approvedAuthors) {
    if (author === approvedAuthor) {
      return true;
    }
  }
  return false;
}