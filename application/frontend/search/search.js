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
    var userInput = decodeURI(document.getElementById('search').value);


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
        preview.classList.add("item");

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
    let contact = document.getElementById('contact');

    let postImage = document.createElement('img');
    let postDesc = document.createElement('div');
    let postPrice = document.createElement('div');
    let postLocation = document.createElement('div');
    let postLicense = document.createElement('div');
    let date = document.createElement('div');

    postImage.classList.add("item");

    postDetails.innerHTML = "";
    postImageDiv.innerHTML = "";
    postLicense.innerHTML = "";
    postLocation.innerHTML = "";

    if (getCookie("userAuth") != null && data.post.cost == 0) {
        postPrice.innerHTML = '<h4><strong>Price:</strong> Free</h4>';
        download.href = 'http://3.22.78.154:3000' + data.post.media_content;
        download.classList.remove('disabled');
    } else {
        document.getElementById('loginPLS').innerHTML = `Interested in buying the product? Contact the seller!`;
        postPrice.innerHTML = `<h4><strong>Price:</strong> $${data.post.cost}</h4>`;
        if (data.post.cost == 0) {
            postPrice.innerHTML = '<h4><strong>Price:</strong> Free</h4>';
            document.getElementById('loginPLS').innerHTML = `In order to download free media, please login.`;
        }
        download.classList.add('disabled');
        download.removeAttribute('href');
    }

    postTitleDiv.innerHTML = data.post.title;
    postDesc.innerHTML = `<strong>Description:</strong> ${data.post.post_body} <p></p>`;
    date.innerHTML = `<strong>Date created:</strong> ${formatDate(data.post.create_time)}`;
    postImage.src = data.post.media_preview;
    contact.onclick = function () { redirectToMessage(data.post.creator_email) };

    postDetails.appendChild(postPrice);
    postDetails.appendChild(postDesc);
    postDetails.appendChild(date);

    postImageDiv.appendChild(postImage);

    if (data.post.license != null) {
        postLicense.innerHTML = `<strong>Licensing:</strong> ${data.post.license}`;
        postDetails.appendChild(postLicense);
    }

    if (data.post.locations.length != 0) {
        postLocation.innerHTML = `<strong>Meet up location:</strong> ${data.post.locations}`;
        postDetails.appendChild(postLocation);
    }

}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}


/**
 * formats the date into from ISO 8601 format
 * to a more readable format (MM/DD/YY HH/MM PM:AM)
 */
function formatDate(date) {
    let dateObj = new Date(date);
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();
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

    let newDate = `${month}/${day}/${year}, ${hours}:${minutes}${ampm}`
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
    URL = decodeURI(URL);

    document.getElementById('search').value = decodeURI(data.title);
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

function redirectToMessage(userEmail) {
    window.location.href = 'http://3.22.78.154:3000/contact-page/contact.html?contact=' + userEmail;
}
