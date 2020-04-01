
function search() {
    var request = new XMLHttpRequest();
    var URL = 'http://3.22.78.154:3000/post/search?';


    var userInput = document.getElementById('search').value;
    var category = document.getElementById("categories").value;

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

function appendData(data) {

    var mainContainer = document.getElementById("search-results");

    for(var i = 0; i < data.posts.length; i++) {
        console.log(data.posts[i].title);
        var div = document.createElement("div");
        div.innerHTML = 'Title: ' + data.posts[i].title;
        mainContainer.appendChild(div);
    }

}


    