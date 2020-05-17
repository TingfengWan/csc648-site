/* Created by Qian Hu */
/* Helped by Marvin Nguyen and John Joshua Gutierrez*/
/**
 * Made on Mid-April
 */


// This shows what items the user purchased
function accountPurchased() {
    let email = getCookie("userAuth");

    let URL = "http://3.22.78.154:3000/user/purchases?email=" + email;

    axios.get(URL)

        .then(res => {
            console.log(res.data)
            let purchasedDump = document.getElementById("purchasedDump")

            for (let i = 0; i < res.data.purchased_posts.length; i++) {
                let purchased = res.data.purchased_posts[i];
                let element = document.createElement("h3");
                element.innerHTML = `Title:${purchased.title}: Date:${formatDate(purchased.create_time)} Cost:${purchased.cost}`;
                purchasedDump.appendChild(element);
            }

        }).catch(err => console.log(err))

}

//This shows what items the user posted
function accountPost() {
    let email = getCookie("userAuth");

    let URL = "http://3.22.78.154:3000/user/posts?email=" + email;


    axios.get(URL)

        .then(res => {
            console.log(res.data)
            let postDump = document.getElementById("postDump")

            for (let i = 0; i < res.data.posts.length; i++) {
                let post = res.data.posts[i];
                let element = document.createElement("h3");
                element.innerHTML = `Title: ${post.title}, Date: ${formatDate(post.create_time)}, Cost: ${post.cost}`;
                postDump.appendChild(element);
            }

        }).catch(err => console.log(err))

}

//Shows the basic info of the user
function userInfo() {
    let email = getCookie("userAuth");
    let URL = "http://3.22.78.154:3000/user?email=" + email;
    axios.get(URL)

        .then(res => {
            document.getElementById("name").innerHTML = "Name: " + res.data.user[0].first_name + " " + res.data.user[0].last_name;
            document.getElementById("email").innerHTML = "Email: " + res.data.user[0].email;
            document.getElementById("phone").innerHTML = "Phone Number: " + res.data.user[0].phone_number;


        })

}

//A function that parses date to make it look nicer
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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
