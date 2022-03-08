window.onload = function () {
    $('#create-pun-form').submit(createPun);
}

async function createPun(e) {
    e.preventDefault();
    
    //snaps up the form
    const formData = new FormData(e.target);
    const contentObj = {
        content: formData.get('content')
    };
    //converts the content to JSON
    const JSONContent = JSON.stringify(contentObj);

    try {
        //POSTs the JSON to the API in a new pun
        const response = await fetch('https://puns-app.herokuapp.com/puns', {
            method: 'POST',
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
}