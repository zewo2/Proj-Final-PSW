var con = require('../connection.js');

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        throw err;
    }
    console.log("Connected!");
    
    var sqlfunc = `
    CREATE TABLE IF NOT EXISTS funcionarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        idade INT(3),
        email VARCHAR(255) NOT NULL UNIQUE,
        telefone VARCHAR(20),
        tipo ENUM('janitor' ,'personal_trainer', 'receptionist', 'manager') NOT NULL,
        morada VARCHAR(255),
        codigo_postal VARCHAR(50)
    )`;
    
    con.query(sqlfunc, function (err, result) {
        if (err) {
            console.error('Error creating funcionarios table:', err);
            throw err;
        }
        console.log("Funcionarios table created successfully!");
        con.end(); // Close the connection
    });
});