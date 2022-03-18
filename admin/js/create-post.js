window.onload = async function () {
	//varable with all approved authors
	const approvedAuthors = await fetchApprovedAuthors();

	//creates the list on the site with approved authors to chose from
	createApprovedAuthorsList(approvedAuthors);

	//when "Post new" btn is clicked 
	$('#createPostForm').submit( function(e) {
		e.preventDefault();
		//takes all info from the form and creates a random gardening image and posts it to the API and creates all the HTML for the site
		submitNewPost(e);
	});
};


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
		$("#authorList").append(`<option value="${approvedAuthor}">${approvedAuthor}</option>`);
	}
}


async function submitNewPost(e) {
	let allTags = [];
	//snaps up the form
	const formData = new FormData(e.target);
	//snaps up all tags
	$.each(formData.getAll("tags"), function (key, tag) {
		allTags.push(tag);
	});

	//variable that calls function that fetches random gardening image
	const gardeningImage = await fetchRandomGardeningImage();

	//Object with all the needed data
	const contentObj = {
		title: formData.get("title"),
		author: formData.get("author"),
		content: formData.get("content"),
		tags: allTags,
		image: gardeningImage,
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

	try {
		// POSTs the JSON to the API as a new post
		const response = await fetch(`http://localhost:5000/posts/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSONContent
		});

	} catch (error) {
		console.log(error);
	}

	//sends the user back to admin site
	window.location.replace("admin.html");
}


async function fetchRandomGardeningImage() {
	try {
		//fetches data about a random gardening image
		const response = await fetch("https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening");
		const imageData = await response.json();
		//makes it JSON
		const gardeningImage = JSON.stringify(imageData);

		//returns the data about the random gardening image
		return gardeningImage;

	} catch (error) {
		console.log(error);
	}
}