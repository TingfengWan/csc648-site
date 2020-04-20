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

function loadTopPurchases() {
    alert('load top purchases method');
}

function loadRecentPosts() {
    alert('load recent posting method');
}

function redirectToSearchResults() {
    var catergory = document.getElementById('category-field').value;
    var userInput = document.getElementById('userInput').value;
    var url = 'http://3.22.78.154:3000/post/search?title=' + userInput + '&category:' + catergory;
    document.location.href = url;
}