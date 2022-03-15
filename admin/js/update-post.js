window.onload = function () {
  authors();
  fetchPost();
  $("#updatePostForm").submit(updatePost);
};

//1) deklarer en variabel globalt så jag kan ha tillgång till den i båda funktionerna
let imgJSON;

async function authors() {
  const authors = await fetch("authors.txt");
  const authorsText = await authors.text();
  const approvedAuthors = authorsText.split(",");

  for (let approvedAuthor of approvedAuthors) {
    $("#authorList").append(`
        <option id="${approvedAuthor}" value="${approvedAuthor}">${approvedAuthor}</option>
        `);
  }
}

async function fetchPost() {
  const urlParams = new URLSearchParams(window.location.search);

  //fetches the specific pun that should be updated
  const response = await fetch(
    `http://localhost:5000/posts/${urlParams.get("id")}`
  );
  const post = await response.json();
  //2) sparar bildobjektet i den globala variabeln i JSON-format (även testat att köra JSON.parse och göra om den till ett objekt)
  imgJSON = post.image;
  console.log(imgJSON);

  document.querySelector("input").value = post.title;
  document.querySelector(`#${post.author}`).setAttribute("selected", "");
  document.querySelector("#contentTextarea").value = post.content;

<<<<<<< HEAD
    document.querySelector('input').value = post.title;
    document.querySelector(`#${post.author}`).setAttribute('selected', '')
    document.querySelector('#contentTextarea').value = post.content;
    let allTags = document.querySelectorAll('.checkbox');
    
    if(post.tags !== null) {
        for (let tag of allTags) {
            for (let postTag of post.tags) {
                if (tag.value === postTag) {
                    tag.checked = true;
                }
            }  
=======
  let allTags = document.querySelectorAll(".checkbox");

  if (post.tags !== null) {
    for (let tag of allTags) {
      for (let postTag of post.tags) {
        if (tag.value === postTag) {
          tag.checked = true;
>>>>>>> 2677dc8e7620de103de1c4dee4ddf08ee1eb27d7
        }
      }
    }
  }
}

async function updatePost(e) {
<<<<<<< HEAD
    e.preventDefault();
    
    const urlParams2 = new URLSearchParams(window.location.search);

    //fetches the specific pun that should be updated
    const response = await fetch(`http://localhost:5000/posts/${urlParams2.get("id")}`);
    const imageData = await response.json();
    const image = imageData.image;

    //snaps up the title and saves it to a variable
    const title = document.querySelector('input').value;
    //snaps up the author and saves it to a variable
    const author = document.querySelector('select').value;
    //snaps up the content and saves it to a variable
    const content = document.querySelector('#contentTextarea').value;
    //snaps up the tags and saves it to a variable
    const allTags = document.querySelectorAll('.checkbox');
    //snaps up the image and saves it to a variable
=======
  e.preventDefault();
  //snaps up the title and saves it to a variable
  const title = document.querySelector("input").value;
  //snaps up the author and saves it to a variable
  const author = document.querySelector("select").value;
  //snaps up the content and saves it to a variable
  const content = document.querySelector("#contentTextarea").value;
  //snaps up the tags and saves it to a variable
  const allTags = document.querySelectorAll(".checkbox");
  //3) sätter en ny variabel som JSON-strängen
  const imgData = imgJSON;
  console.log(imgData);
>>>>>>> 2677dc8e7620de103de1c4dee4ddf08ee1eb27d7

  let tags = [];
  for (let tag of allTags) {
    if (tag.checked) {
      tags.push(tag.value);
    }
  }

  //4) Lägger till JSON-strängen i detta objekt
  const contentObj = {
    title,
    author,
    content,
    tags,
    imgData,
  };

  console.log(contentObj);

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
  //5) Här ser allt bra ut, men när vi försöker patcha blir det "null" i databasen

  const urlParams = new URLSearchParams(window.location.search);

  try {
    //PATCHes the JSON to the API
    const response = await fetch(
      `http://localhost:5000/posts/${urlParams.get("id")}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONContent,
      }
    );

    if (!response.ok) {
      throw new Error("API Error");
    }

<<<<<<< HEAD
    const contentObj = {
        title,
        author,
        content,
        tags,
        image
    };

    //if title or content is just containing spaces cancel function
    //if they contain stuff remove error
    emptyField = false
    if(contentObj.title.trim() === "") {
        $('#titleError').html('<div>You can not submit an empty Title</div>');
        $('#titleError').removeAttr('hidden');
        emptyField = true;
    } else if(contentObj.title.trim().length > 60) {
        console.log("more then 10");
        $('#titleError').html('<div>The Title can only be 60 characters long</div>');
        $('#titleError').removeAttr('hidden');
        emptyField = true;
    } 
    else {
        $('#titleError').attr('hidden', 'true');
    }

    if (contentObj.content.trim() === "") {
        $('#contentError').html('<div>You can not submit empty Content</div>')
        $('#contentError').removeAttr('hidden');
        emptyField = true;
    } else {
        $('#contentError').attr('hidden', 'true');
    }

    if(emptyField) {
        return false
    }

    //converts the content to JSON
    const JSONContent = JSON.stringify(contentObj);

    const urlParams = new URLSearchParams(window.location.search);

    try {
        //PATCHes the JSON to the API
        const response = await fetch(`http://localhost:5000/posts/${urlParams.get("id")}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONContent
        });

        if(!response.ok) {
            throw new Error('API Error');
        }

        //sends the user back to index site
        window.location.replace('admin.html');

    } catch(error) {
        console.log(error);
    }
}
=======
    //sends the user back to index site
    //window.location.replace("admin.html");
  } catch (error) {
    console.log(error);
  }
}
>>>>>>> 2677dc8e7620de103de1c4dee4ddf08ee1eb27d7
