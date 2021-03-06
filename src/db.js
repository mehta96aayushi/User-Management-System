const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config();

/* Create the database connection */
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'user_management_system'
})

/* Establish MySQL connection */
connection.connect(function(err) {
    if(err) throw err;

    console.log("Database connection established successfully!");
})

module.exports = connection