const con = require('../connection.js');

// Sample data for clientes (customers)
const customers = [
    {
        nome: "Luís Mendes",
        idade: 25,
        email: "luis.mendes@gmail.com",
        telefone: "967890123",
        subscription_tier: "premium",
        ptrainer_id: 2 // Maria Santos
    },
    {
        nome: "Sofia Costa",
        idade: 30,
        email: "sofia.costa@gmail.com",
        telefone: "978901234",
        subscription_tier: "vip",
        ptrainer_id: 5 // Pedro Alves
    },
    {
        nome: "Miguel Rodrigues",
        idade: 22,
        email: "miguel.rodrigues@gmail.com",
        telefone: "989012345",
        subscription_tier: "basic",
        ptrainer_id: null
    },
    {
        nome: "Inês Martins",
        idade: 35,
        email: "ines.martins@gmail.com",
        telefone: "990123456",
        subscription_tier: "premium",
        ptrainer_id: 2 // Maria Santos
    },
    {
        nome: "Ricardo Sousa",
        idade: 28,
        email: "ricardo.sousa@gmail.com",
        telefone: "901234567",
        subscription_tier: "vip",
        ptrainer_id: 5 // Pedro Alves
    }
];

// Connect to database and insert data
con.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log("Connected to database!");

    // Insert customers
    customers.forEach((customer, index) => {
        const sql = "INSERT INTO clientes SET ?";
        con.query(sql, customer, (err, result) => {
            if (err) {
                console.error('Error inserting customer:', err);
                return;
            }
            console.log(`Customer ${customer.nome} inserted with ID: ${result.insertId}`);
            
            // Close connection after last insert
            if (index === customers.length - 1) {
                con.end();
                console.log("Connection closed.");
            }
        });
    });
});