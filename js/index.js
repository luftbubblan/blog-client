window.onload = async function () {
	//varable with all posts and approved authors
  	const data = await fetchAllPostsAndAuthors();

	//varable with all posts
	const posts = data[0];
	//varable with all approved authors
	const approvedAuthors = data[1];

	//prints out the top(big) post to the site
	printTopPost(posts, approvedAuthors);

	let output = [];
	let i = 1;
	let j = 6;
	//prints out the next 5(if there are any) posts to the site
	i = printPostList(posts, approvedAuthors, output, i, j);

	//determines if a "load More Posts" link/btn or a "All Posts Are Loaded" text should be shown
	loadMoreMessage(output);

	//prints more posts to the site if "load More Posts" link/btn is clicked
	loadMorePosts(output, i, j);
};

//will fetch both the posts from the API and also approved authors from a txt file
async function fetchAllPostsAndAuthors() {
  try {
    const data = await Promise.all([
      //fetches all posts
      fetch("http://localhost:5000/posts/").then((resp) => resp.json()),
      //fetches the list with approved authors
      fetch("admin/authors.txt").then((resp) => resp.text()),
    ]);

    //reverses the array of posts
    data[0].reverse();

    //creates an array with the approved authors
    const approvedAuthors = data[1].split(",");

    //returns the posts and the authors
    return [data[0], approvedAuthors];
  } catch (error) {
    console.log(error);
  }
}

//will print the latest post to the top of the site
function printTopPost(posts, approvedAuthors) {
  let topOutput = "";

  //loop all posts
  $.each(posts, function (key, post) {
    //check if the post has an approved author
    if (approvedAuthor(post.author, approvedAuthors)) {
      //varaible with image data
      const img = JSON.parse(post.image);
      //removes all "." from the back of the content string
      while (post.content[post.content.length - 1] === ".") {
        post.content = post.content.slice(0, -1);
      }

      //if over 2000 letters show only 2000, add "..." to the end and set "showReadMoreTopPost" to true
      let showReadMoreTopPost = false;
      if (post.content.length > 2000) {
        post.content = post.content.slice(0, 2000) + "...";
        showReadMoreTopPost = true;
      }

      //variable with the html output that is later getting printed to the site
      topOutput = `
			<li data-id="${post._id}">
				<a href="post.html?id=${post._id}"><h2 id="title"></h2></a>
				
				<div>
					By: <i>${post.author}</i>
				</div>
					
				<p id="content" type="text"></p>
				<a href="post.html?id=${post._id}" id="readMoreTopPost"></a>
				
				<img src="${img.urls.small}" alt="${img.alt_description}">

				<i>${post.date.slice(0, 10)} - ${post.date.slice(11, 16)}</i>
				${showTagsCapitalizeAddSpace(post.tags)}
			</li>
			`;

      //append the output to the site
      $("#top-post").append(topOutput);

      //insert the title as text
      $("#title").text(post.title);

      //insert the content as text
      $("#content").text(post.content);

      //if "showReadMoreTopPost" is true(over 2000 letters) show "Read more"
      if (showReadMoreTopPost) {
        $("#readMoreTopPost").append("Read more");
      }
      //abort the each-loop
      return false;
    }
  });
}

//will print the next 5 posts to the site
function printPostList(posts, approvedAuthors, output, i, j) {
  //loop all posts except the first one(gets printed in printTopPost()) and creates the html for them
  $.each(posts, async function (key, post) {
    //check if the post has an approved author
    if (approvedAuthor(post.author, approvedAuthors)) {
      //varaible with image data
      const img = JSON.parse(post.image);
      //removes all "." from the back of the content string
      while (post.content[post.content.length - 1] === ".") {
        post.content = post.content.slice(0, -1);
      }

      //if over 100 letters show only 100, add "..." to the end
      if (post.content.length > 100) {
        post.content = post.content.slice(0, 100) + "...";
      }

      //pushes the html to the output array, that is later getting printed to the site
      output.push(`
			<li class="post" data-id="${post._id}">
				<div class="leftSideOfPost">
					<img src="${img.urls.small}" alt="${img.alt_description}">
				</div>
				
				<div class="rightSideOfPost">
					<a href="post.html?id=${post._id}"><h2>${post.title}</h2></a>
					
					By: <i>${post.author}</i>
					
					<p>${post.content}</p>
					<a href="post.html?id=${post._id}" id="readMore${
        post._id
      }" class="readMore"></a>
					
					<div class="dateAndTags">
						<i>${post.date.slice(0, 10)} - ${post.date.slice(11, 16)}</i>
						${showTagsCapitalizeAddSpace(post.tags)}
					</div>
				</div>
			</li>
			`);
    }
  });

  //append the output array to the site, with index 1,2,3,4,5
  //i = 1, j = 6
  for (; i < j; i++) {
    $("#post-list").append(output[i]);
  }

  // show "Read more" text on posts with more than 100 letters
  $.each(posts, function (key, post) {
    if (approvedAuthor(post.author, approvedAuthors)) {
      if (post.content.length > 100) {
        $(`#readMore${post._id}`).append("Read more");
      }
    }
  });
  //returns i to be used in load more posts
  return i;
}

//if all posts are loaded(less then 6) show message otherwise show load more link
function loadMoreMessage(output) {
  if (output.length <= $("li").length) {
    $("#allPostsLoaded").removeAttr("hidden");
  } else {
    $("#loadMorePosts").removeAttr("hidden");
  }
}

//on click load 5 more posts or show that there are no more posts to load
function loadMorePosts(output, i, j) {
  $("#loadMorePosts").click(function () {
    j += 5;
    for (; i < j; i++) {
      $("#post-list").append(output[i]);
    }
    if (output.length == $("li").length) {
      $("#allPostsLoaded").removeAttr("hidden");
      $("#loadMorePosts").attr("hidden", "true");
    }
  });
}

//function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
function showTagsCapitalizeAddSpace(array) {
  if (array === null) {
    return "";
  } else if (array.length !== 0) {
    return `
				<div>Tags: 
				${array.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(", ")}
				</div>
			`;
  } else {
    return "";
  }
}

//checks if the author of the post is an approved author
function approvedAuthor(author, approvedAuthors) {
  for (let approvedAuthor of approvedAuthors) {
    if (author === approvedAuthor) {
      return true;
    }
  }
  return false;
}
