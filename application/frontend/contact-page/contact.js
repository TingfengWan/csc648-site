//Author: John Joshua Gutierrez
//Made Mid May

//GET to http://3.22.78.154:3000/user/message?userEmail=test@sfsu.edu
//POST to http://3.22.78.154:3000/user/message

function sendMessage() {
    const URL = 'http://3.22.78.154:3000/user/message';
    let message = 'Gimme the goods';
    //let sender = parseCookie(document.cookie);
    let sender = 'test@sfsu.edu';
    let recipient = 'student@sfsu.edu';

    axios.post(URL, {
        sender_email: sender,
        recipient_email: recipient,
        message: message
    })
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
    });

}

function getMessages() {
    let email = 'test@sfsu.edu';
    let URL = 'http://3.22.78.154:3000/user/message?userEmail=' + email;
    //let email = parseCookie(document.cookie);
    axios.get(URL)
    .then(res => {
        console.log(res.data);
        displayInbox(res.data);
        displaySent(res.data);
    })
    .catch(err => {
        console.log(err);
    });
}


function displayInbox(data) {

    for(let i=0; i < data.messages.length; i++) {

        let inbox = document.getElementById('inboxDiv');
        let container = document.createElement('div');
        let email = document.createElement('div');
        let message = document.createElement('div');
        let date = document.createElement('div');
        
        container.classList.add('container-fluid');
        container.classList.add('row');
        container.classList.add('border');
        container.classList.add('border-secondary');
        email.classList.add('col');
        message.classList.add('col');
        date.classList.add('col');
        
        
        if(data.messages[i].recipient_email == "test@sfsu.edu") {
            email.innerHTML = `${data.messages[i].sender_email}`;
            message.innerHTML = `${data.messages[i].message}`;
            date.innerHTML = `${data.messages[i].timestamp}`;
        }
        console.log(date);

        inbox.appendChild(container);
        container.appendChild(email);
        container.appendChild(message);
        container.appendChild(date);
    }
}

function displaySent(data) {

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

