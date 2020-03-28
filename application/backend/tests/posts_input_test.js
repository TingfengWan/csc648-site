const mysql = require('mysql');

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
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Rubber Ducky",\
        LOAD_FILE("../../assets/default.png"),\
        LOAD_FILE("../../assets/default.png"),\
        "RubberDucky.png",\
        true,\
        "admin_faculty_test@sfsu.edu",\
        "A bluber ducky.",\
        true\
    )');
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Science floating thingy",\
        LOAD_FILE("../../assets/default.png"),\
        LOAD_FILE("../../assets/default.png"),\
        "RubberDucky.png",\
        true,\
        "admin_faculty_test@sfsu.edu",\
        "A floating device.",\
        true\
    )');
    database.query('INSERT INTO Posts(creator_email,title,media_preview,media_content,file_name,has_file,cost,approver_email,post_body,is_approved) VALUES (\
        student_test@sfsu.edu,\
        "Van Gough Duck",\
        LOAD_FILE("../../assets/default.png"),\
        LOAD_FILE("../../assets/default.png"),\
        "RubberDucky.png",\
        true,\
        15.0,\
        "admin_faculty_test@sfsu.edu",\
        "An artistic duck.",\
        true\
    )');
});
