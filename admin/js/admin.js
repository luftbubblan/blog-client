"use strict";

window.onload = () => fetchAllPosts();

const errDiv = document.querySelector("#errDiv");

async function fetchAllPosts() {
  try {
    const response = await fetch("http://localhost:5000/posts/");
    const posts = await response.json();
    posts.reverse();

    const authors = await fetch("authors.txt");
    const authorsText = await authors.text();
    const approvedAuthors = authorsText.split(",");

    if (!response.ok) {
      throw new Error("Error!");
    }

    let html = "";

    posts.forEach((post) => {
      if (trueAuthor(post.author, approvedAuthors)) {
        html += ` 
        <tr>
          <td><a href="/post.html?id=${post._id}">${post.title}</a></td>
          <td>${post.author}</td>
          <td>${showTagsCapitalizeAddSpace(post.tags)}</td>
          <td>${post.date.slice(0, 10)},<br>${post.date.slice(11, 16)}</td>
          <td><a href="update-post.html?id=${
            post._id
          }">Update</a> / <a href="#" class="delete-task" data-task-id="${
          post._id
        }">Delete</a></td>
        </tr>
        `;
      }
    });

    document.querySelector("#tBody").innerHTML = html;
    deletingTasks();
  } catch (err) {
    errDiv.innerHTML = `There was an error (${err}). Try again!`;
  }
}

//function for deleting tasks
function deletingTasks() {
  const deleteTask = document.querySelectorAll(".delete-task");

  for (let task of deleteTask) {
    task.addEventListener("click", async (e) => {
      e.preventDefault;

      const taskId = e.target.dataset.taskId;

      try {
        await fetch(`http://localhost:5000/posts/${taskId}`, {
          method: "DELETE",
        });
        e.target.parentNode.parentNode.remove();
      } catch (err) {
        console.log(err);
      }
    });
  }
}

//function for showing tags (leaving empty ones out), capitalize first tag character and add space after ","
function showTagsCapitalizeAddSpace(array) {
  if (array === null) {
    return "";
  } else if (array.length !== 0) {
    return `${array
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(", ")}`;
  } else {
    return "";
  }
}

//function for only getting posts from the authors of the site
function trueAuthor(author, approvedAuthors) {
  for (let approvedAuthor of approvedAuthors) {
    if (author === approvedAuthor) {
      return true;
    }
  }
  return false;
}
