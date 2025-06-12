var con = require('../connection.js');

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log("Connected!");
    
    var sqlcli = `
    CREATE TABLE IF NOT EXISTS clientes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        idade INT(3),
        email VARCHAR(255) NOT NULL UNIQUE,
        telefone VARCHAR(20),
        subscription_tier ENUM('basic', 'premium', 'vip') NOT NULL DEFAULT 'basic',
        ptrainer_id INT,
        FOREIGN KEY (ptrainer_id) REFERENCES funcionarios(id) ON DELETE SET NULL
    )`;
    
    con.query(sqlcli, function (err, result) {
        if (err) {
            console.error('Error creating clientes table:', err);
            throw err;
        }
        console.log("Clientes table created successfully!");
        con.end(); // Close the connection
    });
});