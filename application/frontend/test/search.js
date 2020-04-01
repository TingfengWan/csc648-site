
/**
 * fetches data for the search results
 * from the database and displays it
 */
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

/**
 * displays the data
 * from the server into HTML
 */
function appendData(data) {

    var mainContainer = document.getElementById("search-results");

    for(var i = 0; i < data.posts.length; i++) {

        var post = data.posts[i];
        var divTitle = document.createElement('div');      
        var divDesc = document.createElement('div');
        const preview = document.createElement('img');

        preview.src = 'data:image/png;base64,' + data.test;

        divTitle.innerHTML = '<h1> Title: ' + post.title + '</h1>';
        divDesc.innerHTML = '<p> Description: ' + post.post_body + '</p>' +
                            '<p> Cost: $' + post.cost + '</p>';

  
        mainContainer.appendChild(divTitle);
        mainContainer.appendChild(preview);
        mainContainer.appendChild(divDesc);
    }

}


    