window.onload = function () {
    fetchAllPuns();
}

async function fetchAllPuns() {
    const response = await fetch('https://puns-app.herokuapp.com/puns');
    const puns = await response.json();
    //creates empty output
    let outputListOfPuns = "";

    //fills the output with all puns that are fetched
    $.each(puns, function(key, value) {
        outputListOfPuns += (`
            <li class="list-group-item">
                <p>
                    ${value.content} <br>
                    <span class="date">- ${value.date}</span>
                </p>
                
                <div>
                    <a href="update-pun.html?id=${value._id}" id="update">Update</a> |
                    <a href="" data-id="${value._id}" id="delete">Delete</a> 
                </div>
            </li>
        `);   
    });
    //prints the puns to the site
    $('#pun-list').html(outputListOfPuns);
    //runs counter function
    counter(puns.length);
    
    $('a').click(async function(e) {
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
        fetchAllPuns();
    });
}

//shows how many puns is on the site
function counter(nbrOfPuns) {
    $('#count').html(`${nbrOfPuns} puns found`);
}