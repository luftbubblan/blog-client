window.onload = function () {
    $('#createPostForm').submit(createPost);
}

async function createPost(e) {
    e.preventDefault();
    
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
        tags: allTags,
        image: "some-image.jpg"
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