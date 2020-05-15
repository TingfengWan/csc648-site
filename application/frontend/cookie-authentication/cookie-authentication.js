if(getCookie("userAuth") == null) {
    window.location = '../cookie-authentication/not-logged-in.html';
} else {
    console.log("a user is logged in");
    let createPostButton = document.getElementById('createPostButton');
    let loginButton = document.getElementById('loginButton');
    let registerButton = document.getElementById('registerButton');

    createPostButton.innerHTML = "Setting";
    loginButton.innerHTML = "Account Page";
    registerButton.innerHTML = "Logout";

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

