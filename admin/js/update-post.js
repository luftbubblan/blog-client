window.onload = async function () {
    //varable with all approved authors
	const approvedAuthors = await fetchApprovedAuthors();

	//creates the list on the site with approved authors to chose from
	createApprovedAuthorsList(approvedAuthors);


    //variable with the data about the posts urlParams
    const postURL = urlParams();

    //varable with the data about the post that is supose to get updated
    const post = await fetchPost(postURL);

    //using the data from the fetched post to fills in values in the input, textarea and author
    fillInFetchedPostValues(post);

    //when "Post new" btn is clicked 
	$('#updatePostForm').submit(async function(e) {
		e.preventDefault();
		//variable that calls function that takes all info from the form and creates a random gardening image and creates error messages if needed
		const postObject = await createPostObject(e, post);
        //PATCHes it to the API
		patchPost(postObject, postURL);
	})
}


async function fetchApprovedAuthors() {
	try {
		//fetches the approved authors from the txt file and makes it an array
		const authors = await fetch("authors.txt");
		const authorsText = await authors.text();
		const approvedAuthors = authorsText.split(",");
		  
		//returns the array with approved authors
		return approvedAuthors;

	} catch (error) {
		console.log(error);
	}
}


function createApprovedAuthorsList(approvedAuthors) {
	//appends every approved author to the Author menu
	for (let approvedAuthor of approvedAuthors) {
		$("#authorList").append(`<option id="${approvedAuthor}" value="${approvedAuthor}">${approvedAuthor}</option>`);
	}
}


function urlParams() {
    //URLSearchParams to get the posts id
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams;
}


async function fetchPost(urlParams) {
    try {
        //fetches the specific post that should be updated
        const response = await fetch(`http://localhost:5000/posts/${urlParams.get("id")}`);
        const post = await response.json();
    
        //returns the fetched post
        return post;

    } catch (error) {
		console.log(error);
	}
}


function fillInFetchedPostValues(post) {
    //prints fetched post title in the input field
    document.querySelector('input').value = post.title;
    //selects the posts author in the author list
    document.querySelector(`#${post.author}`).setAttribute('selected', '')
    //prints fetched post content in the textfield
    document.querySelector('#contentTextarea').value = post.content;
    //varable with all tags
    let allTags = document.querySelectorAll('.checkbox');
    
    //loops all tags that the fetched post has
    for (let postTag of post.tags) {
        //loops all 7 tags
        for (let tag of allTags) {
            //if the fetched post has the tag check that tag on the site
            if (tag.value === postTag) {
                tag.checked = true;
            }
        }  
    }
}


async function createPostObject(e, post) {
    e.preventDefault();
    
    //snaps up the title and saves it to a variable
    const title = document.querySelector('input').value;
    //snaps up the author and saves it to a variable
    const author = document.querySelector('select').value;
    //snaps up the content and saves it to a variable
    const content = document.querySelector('#contentTextarea').value;
    //snaps up the tags and saves it to a variable
    const allTags = document.querySelectorAll('.checkbox');
    //varable with the image from the fetched post
    const image = post.image;

    //varable with all tags from the fetched post
    let tags = [];
    for (let tag of allTags) {
        if(tag.checked) {
            tags.push(tag.value);
        }
    }

    //Object with all the needed data
    const contentObj = {
        title,
        author,
        content,
        tags,
        image
    };

    //variable used to abort function if a required field is empty
	emptyField = false;

	//if Title only contains spaces, show error message, emptyField = true
	if (contentObj.title.trim() === "") {
		$("#titleError").html("You can not submit an empty Title");
		$("#titleError").removeAttr("hidden");
		emptyField = true;

	//if Title contains more than 60 chars, show error message, emptyField = true
	} else if (contentObj.title.trim().length > 60) {
		$("#titleError").html("The Title can only be 60 characters long");
		$("#titleError").removeAttr("hidden");
		emptyField = true;

	//if Title error message was shown and the error has been corrected hide the error div
	} else {
		$("#titleError").attr("hidden", "true");
	}

	//if Content only contains spaces, show error message, emptyField = true
	if (contentObj.content.trim() === "") {
		$("#contentError").html("You can not submit empty Content");
		$("#contentError").removeAttr("hidden");
		emptyField = true;

	//if Content error message was shown and the error has been corrected hide the error div
	} else {
		$("#contentError").attr("hidden", "true");
	}

	//if emptyField = true cancel the function(form is not submited, user gets error messages instead)
	if (emptyField) {
		return false;
	}

	//converts the content to JSON
	const JSONContent = JSON.stringify(contentObj);

    //returns the new post object as JSON
    return JSONContent;
}


async function patchPost(JSONContent, urlParams) {
    try {
        //PATCHes the JSON to the API
        const response = await fetch(`http://localhost:5000/posts/${urlParams.get("id")}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONContent
        });

        //sends the user back to admin site
        window.location.replace('admin.html');

    } catch(error) {
        console.log(error);
    }
}