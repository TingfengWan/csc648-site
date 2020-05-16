if (getCookie("userAuth") != null) {
    console.log("a user is logged in");
    let navbar = document.getElementById('navbar');
    let settingButton = document.getElementById('createPostButton');
    let accountButton = document.getElementById('loginButton');
    let logoutButton = document.getElementById('registerButton');

    let createPost = document.createElement('a');
    createPost.classList.add('user');

    createPost.innerHTML = "Create Post";
    settingButton.innerHTML = "Setting";
    accountButton.innerHTML = "Account Page";
    logoutButton.innerHTML = "Logout";

    createPost.setAttribute('href', 'http://3.22.78.154:3000/create-post/create-post.html');
    settingButton.href = "http://3.22.78.154:3000/setting-page/setting.html";
    accountButton.href = "http://3.22.78.154:3000/account-page/account.html";
    logoutButton.removeAttribute('href');
    logoutButton.onclick = logoutClick;

    navbar.appendChild(createPost);
}

function logoutClick() {
    document.cookie = "userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    let createPostButton = document.getElementById('createPostButton');
    let loginButton = document.getElementById('loginButton');
    let registerButton = document.getElementById('registerButton');

    createPostButton.innerHTML = "Create Post";
    loginButton.innerHTML = "Login";
    registerButton.innerHTML = "Register";

    createPostButton.href = "http://3.22.78.154:3000/create-post/create-post.html";


}


function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
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