window.onload = function () {
    $('#updatePostForm').submit(updatePost);
}

async function updatePost(e) {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);

    //fetches the specific pun that should be updated
    // const response = await fetch(`https://puns-app.herokuapp.com/puns/${urlParams.get("id")}`);
    // const pun = await response.json();

    //fills out the textbox with the text from the fetched pun
    // $('#content-textarea').val(pun.content);
    
    let allTags = [];
    //snaps up the form
    const formData = new FormData(e.target);
    $.each(formData.getAll('tags'), function(key, tag) {
        allTags.push(tag);
    })
 
    const contentObj = {
        title: formData.get('title'),
        author: formData.get('author'),
        content: formData.get('content'),
        tags: allTags
    };
    
    //converts the content to JSON
    const JSONContent = JSON.stringify(contentObj);

     try {
        //POSTs the JSON to the API in a new post
        const response = await fetch("http://localhost:5000/posts/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSONContent
        });

        if(!response.ok) {
            throw new Error('API Error');
        }

        //sends the user back to admin site
        window.location.replace('admin.html');

    } catch(error) {
        console.log(error);
    }
}




/**
 * 
 * 
    async function updatePun() {
    const urlParams = new URLSearchParams(window.location.search);

    //fetches the specific pun that should be updated
    const response = await fetch(`https://puns-app.herokuapp.com/puns/${urlParams.get("id")}`);
    const pun = await response.json();

    //fills out the textbox with the text from the fetched pun
    $('#content-textarea').val(pun.content);

    $('#update-pun-form').submit(async function(e) {
        e.preventDefault();

        //snaps up the form
        const formData = new FormData(e.target);
        const contentObj = {
            content: formData.get('content')
        };
        //converts the content to JSON
        const JSONContent = JSON.stringify(contentObj);

        try {
            //PATCHes the JSON to the API in a new pun
            const response = await fetch(`https://puns-app.herokuapp.com/puns/${urlParams.get("id")}`, {
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
            window.location.replace('index.html');

        } catch(error) {
            console.log(error);
        }
    });
}
 * 
 * 
 */

