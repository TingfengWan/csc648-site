const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const formidable = require('formidable');

const {postServerPort, sanitizer} = require('../documentation/lib/consts.js');

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
})

const app = express();
// express middlewares
app.use(cookieParser());
app.use(bodyParser());

const bufferToBase64 = (buf) => {
    // TODO: Base prefix off of file types...
    return 'data:image/png;base64, ' + buf.toString('base64');
};

// POST Request to create a POST.
app.post('/post', (req, res) =>{
    const form = formidable({ multiples: true });
    const body = req.body;
    console.log(body);
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).send({status: 400, message: 'Could not parse request'});
        return;
      }
      res.send(fields, files);
    });
});

// returns list of categories
app.get('/post/categories', (req, res) => {
    const query = `
        SELECT DISTINCT category FROM PostCategories;
    `;
    database.query(query, (err, result) => {
        if ( err ) {
            res.status(400);
            res.send({
                status: 400,
                message: 'Invalid query'
            });
            return ;
        }
        res.send({
            categories: result
        });
    });

});

// ie. /post/search?title=BobInAHat&categories=math,science
app.get('/post/search', (req, res) => {
    console.log(`Title: ${req.query.title}`);
    console.log(`Category: ${req.query.category}`);
    let title = sanitizer(req.query.title) || '';
    let category = sanitizer(req.query.category) || '';
    let creator_email = sanitizer(req.query.creator_email) || '';
    let query = 'SELECT * FROM Posts';

    console.log(`Sanitized Title: ${title}`);
    console.log(`Sanitized Category: ${category}`);
    console.log(`Sanitized Email: ${creator_email}`);

    if ( title || category || creator_email ) {
        // if no query params, return all posts
        query += ' AS P WHERE ';
        let whereConditions = '';
        if ( creator_email ) {
            whereConditions += `P.creator_email = "${creator_email}"`
        }
        if ( title ) {
            // if there is title, add clause
            if ( whereConditions !== '' ) {
                // if there was previous clause, add conjunction
                whereConditions += ` AND `;
            }
            whereConditions += `P.title LIKE "%${title}%"`;
        }
        if ( category ) {
	        category = category.split(',');
            if ( whereConditions !== '' ) {
                // if there was previous clause, add conjunction
                whereConditions += ` AND `;
            }
            whereConditions += `
                P.id IN (SELECT PC0.post_id
                    FROM PostCategories AS PC0
                    WHERE P.id = PC0.post_id
                    AND PC0.category = "${category[0]}")
                `;
            for ( let i = 1; i < category.length; i++ ) {
                // join all other categories with AND conjunctions
                whereConditions += `
                    AND P.id IN (SELECT PC${i}.post_id
                        FROM PostCategories AS PC${i}
                        WHERE P.id = PC${i}.post_id
                        AND PC${i}.category = "${category[i]}")
                    `;
            }
        }
        query += whereConditions;
    }
    query += ';';
    console.log(query);
    database.query(query, (err, result) => {
        if ( err ) {
	    console.log(err);
            res.status(400);
            res.send({
                status: 400,
                message: 'Invalid query'
            });
            return ;
        }
        result = result.map(post => ({
            id: post.id,
            creator_email: post.creator_email,
            title: post.title,
	        create_time: post.create_time,
            file_name: post.file_name,
            has_file: post.has_file,
            cost: post.cost,
            approver_email: post.approver_email,
            post_body: post.post_body,
            is_approved: post.is_approved,
            media_preview: bufferToBase64(post.media_preview),
        }));
        res.send({
            posts: result
        });
    });
});

// /post/user

app.listen(postServerPort, () => {
    console.log(`Post Server listening on ${postServerPort}`);
});
