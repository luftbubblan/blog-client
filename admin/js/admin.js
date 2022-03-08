window.onload = () => fetchAllPosts();

const errDiv = document.querySelector("#errDiv");

async function fetchAllPosts() {
  try {
    const response = await fetch("http://localhost:5000/posts/");
    const posts = await response.json();
    console.log(posts);

    if (!response.ok) {
      throw new Error("Error!");
    }

    let html = "";

    for (let post of posts) {
      html += ` 
      <tr>
      <td>${post.title}</td>
      <td>${post.author}</td>
      <td>${post.date.slice(0, 10)} ${post.date.slice(11, 16)}</td>
      <td><a href="update-post.html?id=${
        post._id
      }">Update</a> / <a href="#" class="delete-task">Delete</a></td>
      </tr>
      
      `;
    }

    document.querySelector("#tBody").innerHTML = html;
  } catch (err) {
    console.log(err);
    errDiv.innerHTML = `There was an error (${err}). Try again!`;
  }

  const deleteTask = document.querySelectorAll(".delete-task");
  console.log(deleteTask);

  // add eveneListener here!
}
