
/**
 * fetches data for the search results
 * from the database and displays it
 */
// function searching(event) {
//     event.preventDefault();
//     var URL = 'http://3.22.78.154:3000/post/search?';

//     var userInput = document.getElementById('search').value;
//     var category = document.getElementById("categories").value;
//     console.log("User Input: " + userInput);

//     var searchTitle = 'title='.concat(userInput);
//     var categoryTerm = 'category='.concat(category);
//     var searchURL = URL.concat(searchTitle, '&', categoryTerm);
//     searchURL = encodeURI(searchURL);

//     document.location.href = searchURL;
//     console.log(categoryTerm + searchTitle);
//     console.log(searchURL);

//     fetch(
//         searchURL
//     )
//         .then(data => {
//             return data.json();
//         })
//         .then(function (data) {
//             console.log(data);
//             appendData(data);
//         })
//         .catch(err => {
//             console.log(err);
//         });

// }

/**
 * displays the data
 * from the server into HTML
 */
function appendData(data) {

    var mainContainer = document.getElementById("list-results");
    var resultContainer = document.getElementById("results");
    var userInput = document.getElementById('search').value;


    if (data.posts.length == 0) {
        mainContainer.innerHTML = 'No results';
    }
    resultContainer.innerHTML = `<p>${data.posts.length} of ${data.posts.length} results for "${userInput}"</p>`;

    for (var i = 0; i < data.posts.length; i++) {

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
        if (post.cost == 0) {
            divCost.innerHTML = '<p>Free</p>';
        } else {
            divCost.innerHTML = `<p>${post.cost}</p>`;
        }
        preview.src = post.media_preview;

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

            for (let i = 0; i < categories.length; i++) {
                let node = document.createElement("option");
                node.value = categories[i].category;
                let text = document.createTextNode(categories[i].category);
                node.appendChild(text);
                categoriesSelect.appendChild(node);
            }

            var url = document.location.href;
            var params = url.split('?')[1].split('&');
            var data = {}, tmp;
            for (var i = 0, l = params.length; i < l; i++) {
                tmp = params[i].split('=');
                data[tmp[0]] = tmp[1];
            }
            document.getElementById('categories').value = data.category;
        })
        .catch(err => {
            console.log(err);
        });
}

function loadSearchResults() {
    var url = document.location.href;
    var params = url.split('?')[1].split('&');
    var data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=');
        data[tmp[0]] = tmp[1];
    }
    var URL = 'http://3.22.78.154:3000/post/search?title=' + data.title + '&category=' + data.category;
    URL = encodeURI(URL);

    document.getElementById('search').value = data.title;
    fetch(
        URL
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

function redirectToSearchResults() {
    event.preventDefault();
    var category = document.getElementById('categories').value;
    var userInput = document.getElementById('search').value;
    var url = 'http://3.22.78.154:3000/search/search.html?title=' + userInput + '&category=' + category;
    //var url = 'file:///C:/Users/bubbl/OneDrive/Desktop/School/CSC%20648/csc648-fa20-team03/application/frontend/search/search.html?title=' + userInput + '&category=' + category;
    document.location.href = url;
}