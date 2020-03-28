const mysql = require('mysql');
const fs = require('fs');

function readImageFile(file) {
// read binary data from a file:
    const bitmap = fs.readFileSync(file);
    const buf = new Buffer(bitmap);
    return buf;
}


// create database connections
const database = mysql.createConnection({
    host: 'localhost',
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});
database.connect((err) => {
    const data = readImageFile('../../assets/default.png');
    if (err) throw err;
    console.log('Connected to test database');
    database.query(`USE ${process.env.db_name}`);
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Rubber Ducky",\
        BINARY(:data),\
        BINARY(:data),\
        "RubberDucky.png",\
        true,\
        "admin_faculty_test@sfsu.edu",\
        "A bluber ducky.",\
        true\
    )', {data});
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Science floating thingy",\
        BINARY(:data),\
        BINARY(:data),\
        "RubberDucky.png",\
        true,\
        "admin_faculty_test@sfsu.edu",\
        "A floating device.",\
        true\
    )', {data});
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,cost,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Van Gough Duck",\
        BINARY(:data),\
        BINARY(:data),\
        "RubberDucky.png",\
        true,\
        15.0,\
        "admin_faculty_test@sfsu.edu",\
        "An artistic duck.",\
        true\
    )', {data});
});
