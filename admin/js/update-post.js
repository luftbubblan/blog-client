window.onload = function() {
    updatePun();
}

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