const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const formidable = require('formidable');

const {postServerPort, sanitizer, defaultMediaPreviewPath, FS_ROOT, postMapper} = require('../documentation/lib/consts.js');

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

function twoDigits(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
}
const getMysqlDatetime = (dtObj) => { return dtObj.getUTCFullYear() + "-" + twoDigits(1 + dtObj.getUTCMonth()) + "-" + twoDigits(dtObj.getUTCDate()) + " " + twoDigits(dtObj.getUTCHours()) + ":" + twoDigits(dtObj.getUTCMinutes()) + ":" + twoDigits(dtObj.getUTCSeconds());
};

const validatePostInput = (fields, files) => {
    // check constraints
    if ( files.media_content ) {
        fields.has_file = true;
    } else {
        files.media_content = { path: '' };
        fields.has_file = false;
    }
    if ( fields.cost < 0 || fields.cost > 100000) {
        return {};
    }
    if ( !files.media_preview ) {
        files['media_preview'] = {
            path: defaultMediaPreviewPath
        }
    }
    fields.create_time = getMysqlDatetime(new Date());
    fields.title = sanitizer(fields.title) || '';
    fields.creator_email = sanitizer(fields.creator_email) || '';
    fields.post_body = sanitizer(fields.post_body) || '';

    if ( !fields.creator_email.endsWith('sfsu.edu') ) {
        return {};
    }
    return {
        creator_email: fields.creator_email,
        create_time: fields.create_time,
        title: fields.title,
        media_preview: files.media_preview.path,
        media_content: files.media_content.path || '',
        file_name: files.media_content.name || '',
        has_file: fields.has_file,
        cost: fields.cost || 0.0,
        post_body: fields.post_body
    };
};
// app.get('/post', (req, res) => {

// });
// POST Request to create a POST.
app.post('/post', (req, res) => {
    console.log(FS_ROOT);
    // const fsRoot = process.env.fs_root || '/home/ubuntu/user-files/';
    const form = formidable({ multiples: true, uploadDir: `${FS_ROOT}` });

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(400);
            res.send({status: 400, message: 'Could not parse request'});
            return;
        }
        const queryParams = validatePostInput(fields, files);	//
        const query = `\
            INSERT INTO Posts(creator_email,create_time,title,media_preview,media_content,file_name,has_file,cost,post_body) VALUES (\
                    "${queryParams.creator_email}",\
                    "${queryParams.create_time}",\
                    "${queryParams.title}",\
                    "${queryParams.media_preview}",\
                    "${queryParams.media_content}",\
                    "${queryParams.file_name}",\
                    ${queryParams.has_file},\
                    ${queryParams.cost},\
                    "${queryParams.post_body}"\
                )\
            `;
        database.query(query, (err, result) => {
            console.log(query);
        if (err) {
                console.log(err.message);
            res.status(400);
                res.send({ status: 400, message: 'Broke at query'});
                return;
            }
            // add categories
            //const post = result;
            //console.log(post);
            let cateQuery = `
                    INSERT INTO PostCategories(post_id,category) VALUES\ 
                `;
            fields.categories = fields.categories || ['Other'];
            fields.categories.forEach((category, i) => {
                cateQuery += `
                    (${result.insertId},"${category}")\ 
                `;
            if ( i != fields.categories.length-1) {
                cateQuery+=',';
            }
            });
            console.log(cateQuery);
            database.query(cateQuery, (err, categoryResult) => {
                if (err) {
            console.log(err.message);
                    res.status(400);
                    res.send({status: 400, message: 'Could not enter categories'});
                    return ;
                }
                return res.send({post_id: result.insertId});
            });
        });
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

        result = postMapper(result);
        res.send({
            posts: result
        });
    });
});

// /post/user

app.listen(postServerPort, () => {
    console.log(`Post Server listening on ${postServerPort}`);
});
