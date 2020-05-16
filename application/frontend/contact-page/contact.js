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
    
}

function displaySent(data) {

}

