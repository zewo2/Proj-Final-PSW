const con = require('../connection.js');

// Sample data for funcionarios (employees)
const employees = [
    {
        nome: "João Silva",
        idade: 32,
        email: "joao.silva@gym.com",
        telefone: "912345678",
        tipo: "manager",
        morada: "Rua dos Gerentes, 123",
        codigo_postal: "1000-001"
    },
    {
        nome: "Maria Santos",
        idade: 28,
        email: "maria.santos@gym.com",
        telefone: "923456789",
        tipo: "personal_trainer",
        morada: "Avenida dos Treinadores, 45",
        codigo_postal: "1000-002"
    },
    {
        nome: "Carlos Oliveira",
        idade: 35,
        email: "carlos.oliveira@gym.com",
        telefone: "934567890",
        tipo: "receptionist",
        morada: "Travessa da Recepção, 67",
        codigo_postal: "1000-003"
    },
    {
        nome: "Ana Pereira",
        idade: 40,
        email: "ana.pereira@gym.com",
        telefone: "945678901",
        tipo: "janitor",
        morada: "Beco da Limpeza, 89",
        codigo_postal: "1000-004"
    },
    {
        nome: "Pedro Alves",
        idade: 29,
        email: "pedro.alves@gym.com",
        telefone: "956789012",
        tipo: "personal_trainer",
        morada: "Praça dos Atletas, 10",
        codigo_postal: "1000-005"
    }
];

// Connect to database and insert data
con.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log("Connected to database!");

    // Insert employees
    employees.forEach((employee, index) => {
        const sql = "INSERT INTO funcionarios SET ?";
        con.query(sql, employee, (err, result) => {
            if (err) {
                console.error('Error inserting employee:', err);
                return;
            }
            console.log(`Employee ${employee.nome} inserted with ID: ${result.insertId}`);
            
            // Close connection after last insert
            if (index === employees.length - 1) {
                con.end();
                console.log("Connection closed.");
            }
        });
    });
});