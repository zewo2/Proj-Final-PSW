require('dotenv').config();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost", //fallback values if .env is missing
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "gymdb" //Restricts the connection to the selected database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});

module.exports = con; //Exports the connection module for later use in other files