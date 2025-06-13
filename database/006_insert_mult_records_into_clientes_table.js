const con = require('../connection.js');

// Sample data for clientes (customers)
const clientes = [
    {
        nome: "Luís Mendes",
        idade: 25,
        email: "luis.mendes@gmail.com",
        telefone: "967890123",
        subscription_tier_id: 2, // premium (ID from subscription_tiers table)
        ptrainer_id: 2 // Maria Santos
    },
    {
        nome: "Sofia Costa",
        idade: 30,
        email: "sofia.costa@gmail.com",
        telefone: "978901234",
        subscription_tier_id: 3, // vip (ID from subscription_tiers table)
        ptrainer_id: 5 // Pedro Alves
    },
    {
        nome: "Miguel Rodrigues",
        idade: 22,
        email: "miguel.rodrigues@gmail.com",
        telefone: "989012345",
        subscription_tier_id: 1, // basic (ID from subscription_tiers table)
        ptrainer_id: null
    },
    {
        nome: "Inês Martins",
        idade: 35,
        email: "ines.martins@gmail.com",
        telefone: "990123456",
        subscription_tier_id: 2, // premium (ID from subscription_tiers table)
        ptrainer_id: 2 // Maria Santos
    },
    {
        nome: "Ricardo Sousa",
        idade: 28,
        email: "ricardo.sousa@gmail.com",
        telefone: "901234567",
        subscription_tier_id: 3, // vip (ID from subscription_tiers table)
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

    // First verify subscription tiers exist
    con.query('SELECT id, name FROM subscription_tiers', (err, tiers) => {
        if (err) {
            console.error('Error fetching subscription tiers:', err);
            con.end();
            return;
        }

        // Map tier names to IDs for validation
        const tierMap = {};
        tiers.forEach(tier => {
            tierMap[tier.name] = tier.id;
        });

        // Insert clientes
        clientes.forEach((cliente, index) => {
            // Prepare the cliente data for insertion
            const clienteData = {
                nome: cliente.nome,
                idade: cliente.idade,
                email: cliente.email,
                telefone: cliente.telefone,
                subscription_tier_id: cliente.subscription_tier_id,
                ptrainer_id: cliente.ptrainer_id
            };

            const sql = "INSERT INTO clientes SET ?";
            con.query(sql, clienteData, (err, result) => {
                if (err) {
                    console.error('Error inserting cliente:', err);
                    return;
                }
                console.log(`Cliente ${cliente.nome} inserted with ID: ${result.insertId}`);
                
                // Close connection after last insert
                if (index === clientes.length - 1) {
                    con.end();
                    console.log("Connection closed.");
                }
            });
        });
    });
});