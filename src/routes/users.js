const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var connection = require('../db');

// Create new user
router.post('/users', async (req, res) => {
    /* Create hashed password for security purpose*/
    // const salt = await bcrypt.genSalt()
    // const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // console.log(salt)
    // console.log(hashedPassword)

    // Data of request body object
    var name = req.body.name;
    var emailId = req.body.email;
    var password = re.body.password;

    // Check if a user with the same email address exists
    const checkQueryString = "SELECT email FROM users WHERE email = ?";
    connection.query(checkQueryString, [emailId], function (error, results) {
        // Error occurred while fetching user data
        if (error) {
            console.log(error)
            res.status(500).send()
        } else {
            var length = results.length

            // If a user does not exist with the email address, then create a new user
            if(length == 0) {
                /* When creating/registering a new user, initially last login date is kept as null.
                ** It's value is updated when the user call login endpoint with correct login credentials.
                ** Last login date (and time) should be updated only when the login functionality is called
                */
                const insertQueryString = "INSERT INTO users (name, email, password, last_login_date) VALUES (?, ?, ?, null)";
                connection.query(insertQueryString, [name, emailId, password], function (error, results) {
                    // Error occurred while creating a new user
                    if (error) {
                        console.log(error)
                        res.status(500).send()
                    } else 
                        res.status(201).send("User created successfully!")
                })
            } else {
                // If a user exists with the given email address, then do not create new user and send appropriate message
                res.status(409).send("Email id already exists!")
            }
        }
    })    
});

// Login endpoint
router.post('/users/login', (req, res) => {
    // Data of request body object
    var emailId = req.body.email;
    var password = re.body.password;

    const selectQueryString = "SELECT * FROM users WHERE email = ? AND password = ?";

    /* If hashed password is used, then here, while retrieving the credentials, 
    ** the hashed password should be decrypted in order to compare with the given password in request body
    */

    // Check if a user with provided login credentials exists
    connection.query(selectQueryString, [emailId, password], function (error, results) {
        // Error occurred while fetching user data
        if (error) {
            console.log(error)
            res.status(500).send()
        } else {
            var length = results.length

            // If credentials are not correct, send appropriate message
            if(length == 0) {
                res.status(409).send("Login unsuccessful")
            } else {
                // If login credentials are correct, then update the last login date and time
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
    /* Different possibilities can be checked seperately while login by implementing dfferent queries.
    ** For example, correct email and incorrect password, incorrect email id and correct password 
    */
});

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

// List data for a particular user
router.get('/users/:user_id', (req, res) => {
    userId = req.params.user_id

    const queryString = "SELECT * FROM user_management_system.users WHERE user_id = ?";
    var query = connection.query(queryString, [userId], function (error, results) {
        if (error)
            console.log(error);
        else
            res.json(results);
    });
})

/* Different endpoints for listing a user can be created with different parameters provided in its URI */

// Update the name of a user
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
})

module.exports = router