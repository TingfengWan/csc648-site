/*
Author: Eric Ngo, Ting Feng
Date: April 1st, 2020
*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const fetch = require('node-fetch');


const {userServerPort, sanitizer, postMapper} = require('../documentation/lib/consts.js');

// create database connections
const database = mysql.createConnection({
    host: 'localhost',
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});
database.connect((err) => {
    if (err) throw err;
    console.log('Connected to test database');
    database.query(`USE ${process.env.db_name}`);
});

const app = express();
// express middlewares
app.use(cookieParser());
app.use(bodyParser());
app.use(express.json());

const inputValidationAndSanitization = (body, forLogin) => {
    // validate
    const email = sanitizer(body.email);
    if (!email.endsWith('sfsu.edu')) {
        return null;
    }
    const hashed_password = sanitizer(body.hashed_password);
    if (forLogin) {
        return {
            email,
            hashed_password
        }
    }
    const first_name = sanitizer(body.first_name);
    const last_name = sanitizer(body.last_name);
    const phone_number = sanitizer(body.phone_number);
    const is_admin = false;// must be set manually
    let is_faculty = false;
    if ( body.is_faculty ) {
        is_faculty = true;
    }
    return {
        email,
        first_name,
        last_name,
        phone_number,
        hashed_password,
        is_admin,
        is_faculty
    };
};

// get User's messages sent and recieved
app.get('/user/message', (req, res) => {
    const userEmail = req.query.userEmail;
    if ( !userEmail || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT UM.sender_email, U1.first_name sender_first_name, U1.last_name sender_last_name, UM.recipient_email, U2.first_name recipient_first_name, U2.last_name recipient_last_name, UM.message, UM.timestamp \
        FROM UserMessages UM LEFT JOIN Users U1 ON UM.sender_email = U1.email LEFT JOIN Users U2 ON UM.recipient_email = U2.email \
        WHERE recipient_email=\"${userEmail}\"
        OR sender_email=\"${userEmail}\"
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});
        }
        return res.send({
            messages: result
        });
    });
});

app.post('/user/message', (req, res) => {
    const sender = sanitizer(req.body.sender_email);
    const receiver = sanitizer(req.body.recipient_email);
    const message = sanitizer(req.body.message);

    const query = `
        INSERT INTO UserMessages(sender_email, recipient_email, message) \
        VALUES (\"${sender}\",\"${receiver}\",\"${message}\"); 
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: "Could not create message."});
        }
        return res.send({
            status: 200,
            message: "Message sent!"
        });
    });
});

app.get('/user', (req, res) => {
    const userEmail = sanitizer(req.query.email);
    if ( userEmail === "" || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT *\
        FROM Users\
        WHERE email=\"${userEmail}\"\
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        return res.send({
            user: result
        });
    });
});

const getSetString = (setQuery, fieldName, val, is_string=true) => {
    if (!val) {
        return '';
    }
    let valString = '';
    if (is_string) {
        valString = `\"${val}\"`;
    } else {
        valString = `${val}`;
    }
    if ( setQuery === '' ) {
        return `SET ${fieldName}=${valString} `;
    }
    return `, ${fieldName}=${valString} `;
};

app.post('/user', (req, res) => {
    // sanitize allowed editable fields.
    const sanitizedBody = inputValidationAndSanitization(req.body, false);

    let query = `
        UPDATE Users\ 
    `;
    let setQuery = '';
    setQuery += getSetString(setQuery, "hashed_password", sanitizedBody.hashed_password);
    setQuery += getSetString(setQuery, "last_name", sanitizedBody.last_name);
    setQuery += getSetString(setQuery, "first_name", sanitizedBody.first_name);
    setQuery += getSetString(setQuery, "phone_number", sanitizedBody.phone_number);
    setQuery += getSetString(setQuery, "is_faculty", sanitizedBody.is_faculty, false);
    query += setQuery + ` WHERE email="${sanitizedBody.email}"`;
    console.log(query);
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        if ( result.affectedRows != 1 ) {
            return res.send({ status: 500, message: "An unexpected number of rows have been updated" });
        }
        return res.send({
            status: 200,
            message: "User has been updated"
        });
    });
});

app.get('/user/purchases', (req, res) => {
    const userEmail = sanitizer(req.query.email);
    if ( userEmail === "" || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT P.*,  GROUP_CONCAT(PC.category SEPARATOR ', ') categories, GROUP_CONCAT(PL.location SEPARATOR ', ') locations, U.phone_number creator_phone_number \
        FROM Posts P LEFT JOIN PostCategories PC ON P.id = PC.post_id LEFT JOIN PostLocations PL ON P.id = PL.post_id LEFT JOIN Purchases PS ON P.id = PS.post_id LEFT JOIN Users U ON P.creator_email = U.email \
        WHERE PS.user_email = "${userEmail}" \
        GROUP BY P.id;
    `;

    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        // b/c media_content allowed, no need to map/filter.
        return res.send({
            purchased_posts: postMapper(result)
        });
    });
   
});

app.get('/user/posts', (req, res) => {
    const userEmail = sanitizer(req.query.email);
    if ( userEmail === "" || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT P.*,  GROUP_CONCAT(PC.category SEPARATOR ', ') categories, GROUP_CONCAT(PL.location SEPARATOR ', ') locations, U.phone_number creator_phone_number 
        FROM Posts P LEFT JOIN PostCategories PC ON P.id = PC.post_id LEFT JOIN PostLocations PL ON P.id = PL.post_id LEFT JOIN Users U ON P.creator_email = U.email
        WHERE P.creator_email=\"${userEmail}\"
        GROUP BY P.id;\
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        // b/c media_content allowed for owner, no need to map/filter.
        return res.send({
            posts: postMapper(result)
        });
    });
});

app.post('/user/login', (req, res) => {
    console.log(res.getHeaders());
    const body = inputValidationAndSanitization(req.body, true);
    if (!body) {
        res.status(400);
        return res.send({
            status: false
        });
    }
    let query = `
        SELECT * \
        FROM Users \
        WHERE email=\"${body.email}\" \
            AND hashed_password=\"${body.hashed_password}\" \
        `;

    database.query(query, (err, result) => {
	    console.log(result);
        if ( err || !result.length ) {
            res.status(400);
            res.send({
                status: 400,
                message: 'Invalid credentials'
            });
            return ;
        }
        return res.send({
            status: true,
            message: 'Success!'
        });
    });
});

app.post('/user/signup', (req, res) => {
    const body = inputValidationAndSanitization(req.body, false);
    if (!body) {
        res.status(400);
        return res.send({
            status: false
        });
    }
    let query = `
        INSERT INTO Users(email,first_name,last_name,is_faculty,is_admin,hashed_password,phone_number) \
        VALUES (\
            \"${body.email}\", \
            \"${body.first_name}\", \
            \"${body.last_name}\", \
            ${body.is_faculty}, \
            ${body.is_admin}, \
            \"${body.hashed_password}\", \
            \"${body.phone_number}\" \
        )\
        `;
    database.query(query, (err, result) => {
	console.log(result);
        if ( err || !result ) {
            res.status(400);
            res.send({
                status: 400,
                message: 'Invalid credentials'
            });
            return ;
        }
        return res.send({
            status: true,
            message: 'Success!'
        });
    });
});

app.post('/user/authenticate', (req, res) => {
    if (!req.body.captcha)
        return res.json({ success: false, msg: 'Please select captcha' });

    // Secret key
    const secretKey = '6Le6Qe8UAAAAAGqkMmm24EEU2MyPIbqlUUx4fttK';

    // Verify URL
    const query = stringify({
        secret: secretKey,
        response: req.body.captcha,
        remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

    // Make a request to verifyURL
    fetch(verifyURL)
        .then(res => res.json())
        .then(body => {
            // If not successful
            if (body.success !== undefined && !body.success)
                return res.json({ success: false, msg: 'Failed captcha verification' });

            // If successful
            return res.json({ success: true, msg: 'Captcha passed' });
        })
        .catch(err => {
            console.log('Err', err.message);
            return res.status(400).json({ success: false, msg: 'Captcha failed' });
        });
    
});

app.listen(userServerPort, () => {
    console.log(`User Server listening on ${userServerPort}`);
});
