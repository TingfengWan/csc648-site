
/**
 * fetches data for the search results
 * from the database and displays it
 */
function searching(event) {
    event.preventDefault();
    var URL = 'http://3.22.78.154:3000/post/search?';

    var userInput = document.getElementById('search').value;
    var category = document.getElementById("categories").value;
    console.log("User Input: " +userInput);

    var searchTitle = 'title='.concat(userInput);
    var categoryTerm = 'category='.concat(category);
    var searchURL = URL.concat(searchTitle, '&', categoryTerm);
    searchURL = encodeURI(searchURL);

    console.log(categoryTerm + searchTitle);
    console.log(searchURL);

    fetch(
        searchURL
    )
        .then(data => {
            return data.json();
        })
        .then(function (data) {
            console.log(data);
            appendData(data);
        })
        .catch(err => {
            console.log(err);
        });

}

/**
 * displays the data
 * from the server into HTML
 */
function appendData(data) {

    var mainContainer = document.getElementById("list-results");
    var resultContainer = document.getElementById("results");
    var userInput = document.getElementById('search').value;


    if(data.posts.length == 0) {
        mainContainer.innerHTML = 'No results';
        resultContainer.innerHTML = `<p>${data.posts.length} of ${data.posts.length} results for "${userInput}"</p>`;
    } else {
        resultContainer.innerHTML = `<p>1-${data.posts.length} of ${data.posts.length} results for "${userInput}"</p>`;
        mainContainer.innerHTML = "";
    }

    for(var i = 0; i < data.posts.length; i++) {

        var post = data.posts[i];

        var boarderContainer = document.createElement("div");
        var listingContainer = document.createElement("div");
        var fittingContainer = document.createElement("div");
        boarderContainer.classList.add("post-border");
        listingContainer.classList.add("listing");
        fittingContainer.classList.add("fitting");


        //creating elements to use
        var divTitle = document.createElement('div');
        var divCost = document.createElement('div');
        var divPostTime = document.createElement('div')
        const preview = document.createElement('img')

        //assigning the elements from http://3.22.78.154:3000/post/search
        divTitle.innerHTML = `<h3>${post.title}</h3>`;
        divPostTime.innerHTML = `<p>${post.create_time}</p>`;
        if(post.cost == 0){
            divCost.innerHTML = '<p>Free</p>';
        } else {
            divCost.innerHTML = `<p>${post.cost}</p>`;
        }
        preview.src = post.media_preview;

        //displaying the actual elements
        mainContainer.appendChild(boarderContainer);
        boarderContainer.appendChild(listingContainer);
        listingContainer.appendChild(divTitle);
        listingContainer.appendChild(preview);
        listingContainer.appendChild(fittingContainer);
        fittingContainer.appendChild(divPostTime);
        fittingContainer.appendChild(divCost);
    }
}

function getCategories() {
    let URL = "http://3.22.78.154:3000/post/categories";

    fetch(
        URL
    )
        .then(data => {
            return data.json();
        })
        .then(function (data) {
            const categories = data.categories;
            const categoriesSelect = document.getElementById("categories"); //your <select> id goes here

            for(let i = 0; i < categories.length; i++) {
                let node = document.createElement("option");
                node.value = categories[i].category;
                let text = document.createTextNode(categories[i].category);
                node.appendChild(text);
                categoriesSelect.appendChild(node);
            }
        })
        .catch(err => {
            console.log(err);
        });
}