const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');


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
        // b/c media_content allowed for owner, no need to map/filter.
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
    return `,SET ${fieldName}=${valString} `;
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
        return res.send({
            result: result
        });
    });
});

app.get('/user/purchases', (req, res) => {
    const userEmail = sanitizer(req.query.email);
    if ( userEmail === "" || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT * \
        FROM Purchases t1 \
        INNER JOIN Posts t2 \
        ON t1.post_id = t2.id \
        WHERE t1.user_email=\"${userEmail}\";\
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        // b/c media_content allowed, no need to map/filter.
        return res.send({
            purchased_posts: result
        });
    });
   
});

app.get('/user/posts', (req, res) => {
    const userEmail = sanitizer(req.query.email);
    if ( userEmail === "" || !userEmail.endsWith('sfsu.edu') ) {
        return res.status(400).send({status:400, message: 'Invalid email address'});
    }
    let query = `
        SELECT *\
        FROM Posts\
        WHERE creator_email=\"${userEmail}\"\
    `;
    database.query(query, (err, result) => {
        if ( err || !result ) {
            console.log(err.message);
            return res.status(400).send({status: 400, message: err.message});

        }
        // b/c media_content allowed for owner, no need to map/filter.
        return res.send({
            posts: result
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

app.listen(userServerPort, () => {
    console.log(`User Server listening on ${userServerPort}`);
});
