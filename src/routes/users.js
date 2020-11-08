const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var connection = require('../db');

// Create new user
router.post('/users', (req, res) => {
    // const salt = await bcrypt.genSalt()
    // const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // console.log(salt)
    // console.log(hashedPassword)

    var name = req.body.name;
    var emailId = req.body.email;
    var password = req.body.password;

    const checkQueryString = "SELECT email FROM users WHERE email = ?";
    connection.query(checkQueryString, [emailId], function (error, results) {
        if (error) {
            console.log(error)
            res.status(500).send()
        } else {
            var length = results.length
            if(length == 0) {
                const insertQueryString = "INSERT INTO users (name, email, password, last_login_date) VALUES (?, ?, ?, null)";
                connection.query(insertQueryString, [name, emailId, password], function (error, results) {
                    if (error) {
                        console.log(error)
                        res.status(500).send()
                    } else 
                        res.status(201).send("User created successfully!")
                })
            } else {
                res.status(409).send("Email id already exists!")
            }
        }
    })    
});

// Login endpoint
router.post('/users/login', (req, res) => {
    var body = req.body;

    const selectQueryString = "SELECT * FROM users WHERE email = ? AND password = ?";

    connection.query(selectQueryString, [body.email, body.password], function (error, results) {
        if (error) {
            console.log(error)
            res.status(500).send()
        } else {
            var length = results.length
            if(length == 0) {
                res.status(409).send("Login unsuccessful")
            } else {
                const queryString = "UPDATE users SET last_login_date = NOW() WHERE email = ?";
                var query = connection.query(queryString, [body.email], function (error, results) {
                    if (error)
                        console.log(error);
                    else
                        res.status(200)
                });
                res.status(200).send("Login successfully!")
            }
        }
    })
});

// List data for a particular user
router.get('/users/:user_id', (req, res) => {
    console.log(`GET request: Fetching user with email id ${req.params.user_id}`);

    userId = req.params.user_id

    const queryString = "SELECT * FROM user_management_system.users WHERE user_id = ?";
    var query = connection.query(queryString, [userId], function (error, results) {
        if (error)
            console.log(error);
        else
            res.json(results);
    });
    console.log(query.sql);
})

// List data for all users
router.get('/users', (req, res) => {
    const queryString = "SELECT * FROM user_management_system.users";
    var query = connection.query(queryString, function (error, results) {
        if (error)
            console.log(error);
        else
            res.json(results);
    });
})

// Delete a user
router.delete('/users/:user_id', (req, res) => {
    userId = req.params.user_id

    const queryString = "DELETE FROM users WHERE user_id = ?";
    var query = connection.query(queryString, [userId], function (error, results) {
        if (error)
            console.log(error);
        else
            res.status(200).send("Deleted successfully!")
    });
    console.log(query.sql);
})

// Update a user
router.put('/users/:user_id', (req, res) => {
    var userId = req.params.user_id;

    var name = req.body.name;

    const queryString = "UPDATE users SET name = ? WHERE user_id = ?";
    var query = connection.query(queryString, [name, userId], function (error, results) {
        if (error)
            console.log(error);
        else
            res.status(200).send("Updated successfully!")
    });
    console.log(query.sql);
})

module.exports = router