//Author: John Joshua Gutierrez
//Made Mid May

//GET to http://3.22.78.154:3000/user/message?userEmail=test@sfsu.edu
//POST to http://3.22.78.154:3000/user/message

function sendMessage() {
    const URL = 'http://3.22.78.154:3000/user/message';
    let message = document.getElementById('message-text').value;
    //let sender = parseCookie(document.cookie);
    let sender = getCookie("userAuth");
    let recipient = document.getElementById('recipient-name').value;

    axios.post(URL, {
        sender_email: sender,
        recipient_email: recipient,
        message: message,
    })
        .then(res => {
            console.log(res.data);
            if(res.data.message == "Message sent!") {
                alert('Message sent!');
                window.location.href = 'http://3.22.78.154:3000/contact-page/contact.html';
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function getMessages() {
    let email = getCookie("userAuth");
    let URL = 'http://3.22.78.154:3000/user/message?userEmail=' + email;
    //let email = parseCookie(document.cookie);
    axios.get(URL)
        .then(res => {
            console.log(res.data);
            let inbox = document.getElementById('inboxDiv');
            let sent = document.getElementById('sentDiv');

            for (let i = res.data.messages.length - 1; i >= 0; i--) {

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

                if (res.data.messages[i].sender_email == email) {
                    email.innerHTML = `${res.data.messages[i].recipient_email}`;
                    message.innerHTML = `${res.data.messages[i].message}`;
                    date.innerHTML = `${formatDate(res.data.messages[i].timestamp)}`;

                    sent.appendChild(container);
                    container.appendChild(email);
                    container.appendChild(message);
                    container.appendChild(date);
                } else if (res.data.messages[i].recipient_email == email) {
                    email.innerHTML = `${res.data.messages[i].sender_email}`;
                    message.innerHTML = `${res.data.messages[i].message}`;
                    date.innerHTML = `${formatDate(res.data.messages[i].timestamp)}`;

                    inbox.appendChild(container);
                    container.appendChild(email);
                    container.appendChild(message);
                    container.appendChild(date);
                }

            }

            document.getElementById('typeOfEmail').textContent = "Received From:";
            document.getElementById('displayInbox').classList.add('active');
            document.getElementById('sentDiv').style.display = 'none';

        })
        .catch(err => {
            console.log(err);
        });
}

function displaySent() {
    var sentDiv = document.getElementById('sentDiv');
    var inboxDiv = document.getElementById('inboxDiv');
    var displaySent = document.getElementById('displaySent');
    var displayInbox = document.getElementById('displayInbox');
    document.getElementById('typeOfEmail').textContent = "Sent To:";

    console.log(displaySent.classList.contains('active'));

    if (!displaySent.classList.contains('active')) {
        if (displayInbox.classList.contains('active')) {
            displayInbox.classList.remove('active');
            inboxDiv.style.display = 'none';
        }
        displaySent.classList.add('active');
        sentDiv.style.display = 'block';
    }
}


function displayInbox() {
    var sentDiv = document.getElementById('sentDiv');
    var inboxDiv = document.getElementById('inboxDiv');
    var displaySent = document.getElementById('displaySent');
    var displayInbox = document.getElementById('displayInbox');
    document.getElementById('typeOfEmail').textContent = "Received From:";

    console.log(displayInbox.classList.contains('active'));

    if (!displayInbox.classList.contains('active')) {
        if (displaySent.classList.contains('active')) {
            displaySent.classList.remove('active');
            sentDiv.style.display = 'none';
        }
        displayInbox.classList.add('active');
        inboxDiv.style.display = 'block';
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

function formatDate(date) {
    let dateObj = new Date(date);
    let month = dateObj.getMonth();
    let day = dateObj.getDay();
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

