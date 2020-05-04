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
            
            for(let i = 0; i < categories.length; i++) {
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

//shall be a function that displays top 5 purchases on the home page
function loadTopPurchases() {
    alert('load top purchases method');
}

//shall be a function that displays 5 recent postings to the home page
function loadRecentPosts() {
    alert('load recent posting method');
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
    document.location.href =  encodeURI(url);
}
