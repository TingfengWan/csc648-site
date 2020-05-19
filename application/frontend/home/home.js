/* Created by John Joshua Gutierrez */
/* Made on Early April */

//this function grabs the categories in the database onload
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
            const categoriesSelect = document.getElementById("category-field");
            const departmentContainer = document.getElementById("categoryRow");

            for (let i = 0; i < categories.length; i++) {
                let node = document.createElement("option");
                let categoryCol = document.createElement("div");
                let categoryLink = document.createElement("a");

                categoryCol.classList.add('col-sm');
                categoryLink.classList.add('department');
                categoryLink.href = encodeURI(`http://3.22.78.154:3000/search/search.html?title=&category=${categories[i].category}`);

                node.value = categories[i].category;
                let text = document.createTextNode(categories[i].category);
                categoryLink.innerHTML = `${categories[i].category}`;


                node.appendChild(text);
                departmentContainer.appendChild(categoryLink);
                departmentContainer.appendChild(categoryCol);
                categoriesSelect.appendChild(node);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

//shall be a function that displays 10 recent postings to the home page
function loadRecentPosts() {
    let url = 'http://3.22.78.154:3000/post/recent?limit=10';

    axios.get(url)
        .then((res) => {
            appendData(res.data);
        })
}

function appendData(data) {

    var mainContainer = document.getElementById("list-results");

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
    
    download.onclick = function() {checkCookie();return false};
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
    postImage.src = data.post.media_preview;
    contact.onclick = function () { redirectToMessage(data.post.creator_email)};

    postDetails.appendChild(postPrice);
    postDetails.appendChild(postDesc);
    postDetails.appendChild(date);

    postImageDiv.appendChild(postImage);

    if(data.post.license != null){
        postLicense.innerHTML = `Licensing: ${data.post.license}`;
        postDetails.appendChild(postLicense);
    }

    if(data.post.locations.length != 0){
        postLocation.innerHTML = `Meet up location: ${data.post.locations}`;
        postDetails.appendChild(postLocation);
    }

}

function checkCookie() {
    if (getCookie("userAuth") == null) {
        window.location = '../cookie-authentication/not-logged-in.html';
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

}

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

    let newDate = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`
    return newDate;

}

//when the user enters something in the searchbar
//the input is grabbed and processed into a url that
//the software will redirect the user to
//the user will go to the search results with the url
//the url is parsed in the search page and submitted to show results
function redirectToSearchResults() {
    event.preventDefault();
    var category = document.getElementById('category-field').value;
    var userInput = document.getElementById('userInput').value;
    var url = 'http://3.22.78.154:3000/search/search.html?title=' + userInput + '&category=' + category;
    document.location.href = encodeURI(url);
}

function redirectToMessage(userEmail) {
    window.location.href = 'http://3.22.78.154:3000/contact-page/contact.html?contact=' + userEmail;
}
