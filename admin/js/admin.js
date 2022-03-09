//running function to get all the posts on load
window.onload = () => fetchAllPosts();

const errDiv = document.querySelector("#errDiv");

async function fetchAllPosts() {
  try {
    const response = await fetch("http://localhost:5000/posts/");
    const posts = await response.json();

    if (!response.ok) {
      throw new Error("Error!");
    }

    let html = "";

    posts.forEach((post) => {
      html += ` 
      <tr>
        <td>${post.title}</td>
        <td>${post.author}</td>
        <td>${showTags(post.tags)}</td>
        <td>${post.date.slice(0, 10)} ${post.date.slice(11, 16)}</td>
        <td><a href="update-post.html?id=${
          post._id
        }">Update</a> / <a href="#" class="delete-task" data-task-id="${
        post._id
      }">Delete</a></td>
      </tr>
      `;
    });

    //showing tags in array (basically hiding empty tags)
    function showTags(array) {
      if (array === null) {
        return "";
      } else if (array.length !== 0) {
        return `${array.join(", ")}`;
      } else {
        return "";
      }
    }

    document.querySelector("#tBody").innerHTML = html;
  } catch (err) {
    errDiv.innerHTML = `There was an error (${err}). Try again!`;
  }

  //deleting the tasks
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
