var con = require('../init_connection.js'); //This is the same as making a new connection

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS gymdb", function (err, result) {
        if (err) throw err;
        console.log("Database created sucessfully!");
        con.end(); //Close the connection
    })
});