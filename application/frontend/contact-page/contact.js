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
            let inbox = document.getElementById('inboxDiv');
            inbox.innerHTML = "";
            for (let i = 0; i < res.data.messages.length; i++) {

                let container = document.createElement('div');
                let email = document.createElement('div');
                let message = document.createElement('div');
                let date = document.createElement('div');

                container.classList.add('container-xl');
                container.classList.add('row');
                email.classList.add('col');
                email.classList.add('border');
                email.classList.add('emailFont');
                message.classList.add('col');
                message.classList.add('border');
                message.classList.add('emailFont');
                date.classList.add('col');
                date.classList.add('border');
                date.classList.add('emailFont');
                if (res.data.messages[i].sender_email == "test@sfsu.edu") {
                    email.innerHTML = `${res.data.messages[i].sender_email}`;
                    message.innerHTML = `${res.data.messages[i].message}`;
                    date.innerHTML = `${res.data.messages[i].timestamp}`;
                    console.log(date);
                } else if(res.data.messages.recipient_email == "test@sfsu.edu") {
                    email.innerHTML = `${res.data.messages[i].sender_email}`;
                    message.innerHTML = `${res.data.messages[i].message}`;
                    date.innerHTML = `${res.data.messages[i].timestamp}`;
                    console.log(date);
                    
                } 

                inbox.appendChild(container);
                container.appendChild(email);
                container.appendChild(message);
                container.appendChild(date);
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function displaySent() {
    var x = document.getElementById("inboxDiv");
    if (x.style.display === "none") {
        x.style.display = "block";
        let email = 'test@sfsu.edu';
        let URL = 'http://3.22.78.154:3000/user/message?userEmail=' + email;
        //let email = parseCookie(document.cookie);
        axios.get(URL)
            .then(res => {
                console.log(res.data);
                let inbox = document.getElementById('inboxDiv');
                inbox.innerHTML = "";
                for (let i = 0; i < res.data.messages.length; i++) {

                    if (res.data.messages[i].sender_email == "test@sfsu.edu") {
                        let container = document.createElement('div');
                        let email = document.createElement('div');
                        let message = document.createElement('div');
                        let date = document.createElement('div');

                        container.classList.add('container-xl');
                        container.classList.add('row');
                        email.classList.add('col');
                        email.classList.add('border');
                        email.classList.add('emailFont');
                        message.classList.add('col');
                        message.classList.add('border');
                        message.classList.add('emailFont');
                        date.classList.add('col');
                        date.classList.add('border');
                        date.classList.add('emailFont');


                        email.innerHTML = `${res.data.messages[i].sender_email}`;
                        message.innerHTML = `${res.data.messages[i].message}`;
                        date.innerHTML = `${res.data.messages[i].timestamp}`;
                        console.log(date);

                        inbox.appendChild(container);
                        container.appendChild(email);
                        container.appendChild(message);
                        container.appendChild(date);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        x.style.display = "none";
    }
}


function displayInbox() {

    var x = document.getElementById("inboxDiv");
    var displayInbox = document.getElementById('displayInbox');
    var displaySent = document.getElementById('displaySent');
    if (!displayInbox.classList.contains('active')) {
        displayInbox.classList.add('active');
        x.style.display = "block";
        let email = 'test@sfsu.edu';
        let URL = 'http://3.22.78.154:3000/user/message?userEmail=' + email;
        //let email = parseCookie(document.cookie);
        axios.get(URL)
            .then(res => {
                console.log(res.data);
                let inbox = document.getElementById('inboxDiv');
                inbox.innerHTML = "";
                for (let i = 0; i < res.data.messages.length; i++) {

                    if (res.data.messages[i].recipient_email == "test@sfsu.edu") {
                        let container = document.createElement('div');
                        let email = document.createElement('div');
                        let message = document.createElement('div');
                        let date = document.createElement('div');

                        container.classList.add('container-xl');
                        container.classList.add('row');
                        email.classList.add('col');
                        email.classList.add('border');
                        email.classList.add('emailFont');
                        message.classList.add('col');
                        message.classList.add('border');
                        message.classList.add('emailFont');
                        date.classList.add('col');
                        date.classList.add('border');
                        date.classList.add('emailFont');


                        email.innerHTML = `${res.data.messages[i].sender_email}`;
                        message.innerHTML = `${res.data.messages[i].message}`;
                        date.innerHTML = `${res.data.messages[i].timestamp}`;
                        console.log(date);

                        inbox.appendChild(container);
                        container.appendChild(email);
                        container.appendChild(message);
                        container.appendChild(date);
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        displayInbox.classList.remove('active');
        x.style.display = "none";
    }


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

