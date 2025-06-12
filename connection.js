var mysql = require('mysql2');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "gymdb" //Restricts the connection to the selected database
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con; //Exports the connection module for later use in other files