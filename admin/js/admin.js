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
      }">Update</a> / <a href="">Delete</a></td>
      </tr>
      
      `;
    }

    document.querySelector("#tBody").innerHTML = html;
  } catch (err) {
    console.log(err);
    errDiv.innerHTML = `There was an error (${err}). Try again!`;
  }
}

/*    $('a').click(async function(e) {
        //preventsDefault from Del-btn, fetches correct pun and deletes it from API
        if($(this).html() === 'Delete') {
            e.preventDefault();

            try {
                const response = await fetch(`https://puns-app.herokuapp.com/puns/${$(this)[0].dataset.id}`, {
                    method: 'DELETE'
                })
        
                if(!response.ok) {
                    throw new Error('API Error');
                }
        
            } catch(error) {
                console.log(error);
            }

        //preventsDefault from refresh btn
        } else if($(this).html() === 'Refresh') {
            e.preventDefault();
        }
        //runs the whole code again (updates the site without reloading the site)
        //runs with both Delete and Refresh btn
        fetchAllPosts();
    });
}

//shows how many puns is on the site
function counter(nbrOfPuns) {
    $('#count').html(`${nbrOfPuns} puns found`);
}  */
