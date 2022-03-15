window.onload = function () {
  authors();
  $("#createPostForm").submit(createPost);
};

async function authors() {
  const authors = await fetch("authors.txt");
  const authorsText = await authors.text();
  const approvedAuthors = authorsText.split(",");

  for (let approvedAuthor of approvedAuthors) {
    $("#authorList").append(`
        <option value="${approvedAuthor}">${approvedAuthor}</option>
        `);
  }
}

async function createPost(e) {
  e.preventDefault();

  let allTags = [];
  //snaps up the form
  const formData = new FormData(e.target);
  $.each(formData.getAll("tags"), function (key, tag) {
    allTags.push(tag);
  });

  //fetches a random gardening picture
  const response = await fetch(
    "https://api.unsplash.com/photos/random/?client_id=ZnDEJlu-KLWTsvfpRtkxmrG6zkv4LIiqLB9acm7hBV8&query=gardening"
  );
  const gardeningImage = JSON.stringify(await response.json());

  const contentObj = {
    title: formData.get("title"),
    author: formData.get("author"),
    content: formData.get("content"),
    tags: allTags,
    image: gardeningImage,
  };

  //if title or content is just containing spaces cancel function
  //if they contain stuff remove error
  emptyField = false;
  if (contentObj.title.trim() === "") {
    $("#titleError").html("<div>You can not submit an empty Title</div>");
    $("#titleError").removeAttr("hidden");
    emptyField = true;
  } else if (contentObj.title.trim().length > 60) {
    console.log("more then 10");
    $("#titleError").html(
      "<div>The Title can only be 60 characters long</div>"
    );
    $("#titleError").removeAttr("hidden");
    emptyField = true;
  } else {
    $("#titleError").attr("hidden", "true");
  }

  if (contentObj.content.trim() === "") {
    $("#contentError").html("<div>You can not submit empty Content</div>");
    $("#contentError").removeAttr("hidden");
    emptyField = true;
  } else {
    $("#contentError").attr("hidden", "true");
  }

  if (emptyField) {
    return false;
  }

  //converts the content to JSON
  const JSONContent = JSON.stringify(contentObj);
  console.log(JSONContent);

  try {
    const authors = await fetch("authors.txt");
    const authorsText = await authors.text();
    const approvedAuthors = authorsText.split(",");

    for (let approvedAuthor of approvedAuthors) {
      $("#authorList").append(`
            <option value="${approvedAuthor}">${approvedAuthor}</option>
            `);
    }
    //POSTs the JSON to the API in a new post
    const response = await fetch("http://localhost:5000/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONContent,
    });

    if (!response.ok) {
      throw new Error("API Error");
    }

    //sends the user back to admin site
    window.location.replace("admin.html");
  } catch (error) {
    console.log(error);
  }
}
