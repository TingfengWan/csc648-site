/**
 * displays the data
 * from the server into HTML
 *
 * Created by Samuel Bahlibi
 * Made on 04/04/2020
 *
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

        var boarderContainer = document.createElement('div');
        var listingContainer = document.createElement('div');
        var fittingContainer = document.createElement('div');
        boarderContainer.classList.add('post-border');
        listingContainer.classList.add('listing');
        fittingContainer.classList.add('fitting');


        //creating elements to use
        var divTitle = document.createElement('div');
        var divCost = document.createElement('div');
        var divPostTime = document.createElement('div');
        const preview = document.createElement('img');

        //assigning the elements from http://3.22.78.154:3000/post/search
        divTitle.innerHTML = `<h3>${post.title}</h3>`;
        divPostTime.innerHTML = `<p>${formatDate(post.create_time)}</p>`;
        if (post.cost == 0) {
            divCost.innerHTML = '<p>Free</p>';
        } else {
            divCost.innerHTML = `<p>$${post.cost}</p>`;
        }
        preview.src = post.media_preview;


        //sets id and uses it to get post details
        boarderContainer.id = post.id;

        //makes modal appear when the container is clicked on
        boarderContainer.setAttribute('data-toggle', 'modal');
        boarderContainer.setAttribute('data-target', '#post');
        boarderContainer.onclick = function () { postModal(this.id); };
        boarderContainer.style = 'cursor: pointer';

        mainContainer.appendChild(boarderContainer);
        boarderContainer.appendChild(listingContainer);
        listingContainer.appendChild(divTitle);
        listingContainer.appendChild(preview);
        listingContainer.appendChild(fittingContainer);
        fittingContainer.appendChild(divPostTime);
        fittingContainer.appendChild(divCost);
    }
}


/**
 * Fetches the post details 
 * from the database
 * and updates the modal with
 * the post information
 */
function postModal(id) {
    let URL = 'http://3.22.78.154:3000/post?id=' + id;
    console.log(URL);
    fetch(
        URL
    )
        .then(data => {
            return data.json();
        })
        .then(function (data) {
            postDetails(data);
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * Takes the data received from the database
 * and puts it into the modal
 */
function postDetails(data) {

    let postTitleDiv = document.getElementById('post-title');
    let postDetails = document.getElementById('post-details');
    let postImageDiv = document.getElementById('post-image');
    let download = document.getElementById('download');

    let postImage = document.createElement('img');
    let postDesc = document.createElement('div');
    let postPrice = document.createElement('div');
    let date = document.createElement('div');

    postDetails.innerHTML = "";
    postImageDiv.innerHTML = "";

    if (data.post.cost == 0) {
        postPrice.innerHTML = 'Price: Free';
        download.href = 'http://3.22.78.154:3000' + data.post.media_content;
        download.classList.remove('disabled');
    }
    else {
        postPrice.innerHTML = `Price: $${data.post.cost}`;
        download.classList.add('disabled');
        download.removeAttribute('href');
    }

    postTitleDiv.innerHTML = data.post.title;
    postDesc.innerHTML = `Description: ${data.post.post_body}`;
    date.innerHTML = `Date created: ${formatDate(data.post.create_time)}`;
    postImage.src = data.media_preview;

    postDetails.appendChild(postPrice);
    postDetails.appendChild(postDesc);
    postDetails.appendChild(date);

    postImageDiv.appendChild(postImage);

}

/**
 * formats the date into from ISO 8601 format
 * to a more readable format (MM/DD/YY HH/MM PM:AM)
 */
function formatDate(date) {
    let dateObj = new Date(date);
    let month = dateObj.getMonth();
    let day = dateObj.getDay();
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = "am";

    if (hours > 12) {
        hours = hours % 12;
        ampm = "pm";
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let newDate = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`
    return newDate;

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
            document.getElementById('categories').value = decodeURI(data.category);
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
    document.location.href = encodeURI(url);
}
