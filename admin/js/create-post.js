window.onload = async function () {
	const approvedAuthors = await fetchApprovedAuthors();

	createApprovedAuthorsList(approvedAuthors);

	$('#createPostForm').submit( function(e) {
		e.preventDefault();
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

	//varable that calls function that fetches random gardening image
	// await fetchRandomGardeningImage();
	const gardeningImage = await fetchRandomGardeningImage();

	//Object with all the neede data
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
	// window.location.replace("admin.html");
}


async function fetchRandomGardeningImage() {
	try {
		const response = await fetch('https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening').then(resp => resp.json());
		const imageData = response.json();

		console.log(imageData);
		return imageData;

	} catch (error) {
		console.log(error);
	}
}