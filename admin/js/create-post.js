window.onload = async function () {
	const data = await fetchRandomPictureAndAuthors();
	// const photoData = data[0];
	const approvedAuthors = data;

	createApprovedAuthorsList(approvedAuthors);

	$('#createPostForm').submit( function(e) {
		e.preventDefault();
		submitNewPost(e);
	});
};


async function fetchRandomPictureAndAuthors() {
	try {
		// const data = await Promise.all([
			//fetch random gardening picture
			// fetch('https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening').then(resp => resp.json()),
			//fetches the list with approved authors
			// fetch('authors.txt').then(resp => resp.text())
		// ]);
		const response = await fetch('authors.txt');
		const aprovedAuthorsData = await response.text();

		//converts fetched image data to JSON
		// data[0] = JSON.stringify(data[0]);
		
		//creates an array with the approved authors
		

		//returns the imagedata and all approved authors
		return aprovedAuthorsJson;
		return [approvedAuthors];
		return aprovedAuthorsData;

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

	fetchRandomGardeningImage();
	// const gardeningImage = fetchRandomGardeningImage();

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
	window.location.replace("admin.html");
}


async function fetchRandomGardeningImage() {
	try {
		const response = await fetch('https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening').then(resp => resp.json());
		const imageData = response.json();

		console.log(imageData)

	} catch (error) {
		console.log(error);
	}
}