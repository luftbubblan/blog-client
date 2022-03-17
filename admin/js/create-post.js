window.onload = async function () {
	const data = await fetchRandomPictureAndAuthors();
	const photoData = data[0];
	const approvedAuthors = data[1];

	createApprovedAuthorsList(approvedAuthors);

	// submitNewPost(photoData);
	$('#createPostForm').submit(submitNewPost(photoData))
};


async function fetchRandomPictureAndAuthors() {
	try {
		const data = await Promise.all([
			//fetch random gardening picture
			fetch('https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening').then(resp => resp.json()),
								//Temporary fetch unspash is timed out, to many calls per hour
								// fetch('https://random.dog/doggos').then(resp => resp.json()),
			//fetches the list with approved authors
			fetch('authors.txt').then(resp => resp.text())
		]);

		//creates an array with the approved authors
		const approvedAuthors = data[1].split(",");
		
								// return [data[0][0], approvedAuthors];
								//remove the above and use the under when using unspashAPI
		return [data[0], approvedAuthors];


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


async function submitNewPost(e, gardeningImage) {
	// $('#createPostForm').submit( async function(e) {
		e.preventDefault();

		let allTags = [];
		//snaps up the form
		const formData = new FormData(e.target);
		//snaps up all tags
		$.each(formData.getAll("tags"), function (key, tag) {
			allTags.push(tag);
		});

		const contentObj = {
			title: formData.get("title"),
			author: formData.get("author"),
			content: formData.get("content"),
			tags: allTags,
			image: gardeningImage,
		};
		console.log(contentObj)

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
			console.log("sent")

		} catch (error) {
			console.log(error);
		}

			//sends the user back to admin site
			// window.location.replace("admin.html");
	// });
}
