
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
          .then(json_data => console.log(json_data))
          .catch(err => {
            console.log(err);
          });

}


    