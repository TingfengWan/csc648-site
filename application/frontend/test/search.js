
function search() {
    var request = new XMLHttpRequest();
    var URL = 'http://ec2-3-21-156-235.us-east-2.compute.amazonaws.com:3000/post/search?';


    var userInput = document.getElementById('search-input').value;
    var category = document.getElementById("categories").value;

    var searchTitle = 'tite='.concat(userInput);
    var categoryTerm = 'category='.concat(category);
    var searchURL = URL.concat(searchTitle, '&', categoryTerm);

    console.log(categoryTerm);
    console.log(searchTitle);
    console.log(searchURL);

    /**
    request.onload = function () {
        console.log(request.reponseText);
    }

    request.open('GET', searchURL, true);
    request.send();
     */

}

/**
function search() {
    var userInput = document.getElementById('search-input').value;
    console.log(userInput);
}

*/

