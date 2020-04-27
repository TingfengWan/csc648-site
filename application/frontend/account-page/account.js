function accountPurchased(){
    let URL = "http://3.22.78.154:3000/user/purchases?email=fudget@sfsu.edu";

    
    axios.get(URL) 
    
    .then ( res => {
        console.log(res.data)
        let purchasedDump = document.getElementById("purchasedDump")

        for(let i=0; i< res.data.purchased_posts.length; i++){
            let purchased = res.data.purchased_posts[i]; 
            let element = document.createElement("h3");
            element.innerHTML= `Title:${purchased.title}: Date:${formatDate(purchased.create_time)} Cost:${purchased.cost}`;
            purchasedDump.appendChild(element);
        }

    }) .catch(err => console.log(err))

}

function accountPost(){
    let URL = "http://3.22.78.154:3000/user/posts?email=student_test@sfsu.edu";

    
    axios.get(URL) 
    
    .then ( res => {
        console.log(res.data)
        let postDump = document.getElementById("postDump")

        for(let i=0; i< res.data.posts.length; i++){
            let post = res.data.posts[i]; 
            let element = document.createElement("h3");
            element.innerHTML= `Title:${post.title}: Date:${formatDate(post.create_time)} Cost:${post.cost}`;
            postDump.appendChild(element);
        }

    }) .catch(err => console.log(err))

}

function userInfo(){
    let URL = "http://3.22.78.154:3000/user?email=test@sfsu.edu";
    axios.get(URL)

    .then( res => {
        document.getElementById("name").innerHTML = "Name: " + res.data.user[0].first_name + " " +res.data.user[0].last_name;
        document.getElementById("email").innerHTML = "Email: " + res.data.user[0].email;
        document.getElementById("phone").innerHTML = "Phone Number: " + res.data.user[0].phone_number;


    })

}

function formatDate(date) {
    let dateObj = new Date(date);
    let month = dateObj.getMonth();
    let day = dateObj.getDay();
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = "am";

    if(hours > 12) {
        hours = hours%12;
        ampm = "pm";
    }
    if(minutes < 10) {
        minutes = "0" + minutes;
      }

    let newDate = `${month}/${day}/${year} ${hours}:${minutes}${ampm}`
    return newDate;

}
