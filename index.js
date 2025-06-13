// Sistema de Gestão Ginásio - Backend

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const db = require('./connection.js'); //This is the same as making a new connection
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware to parse JSON bodies
app.use(express.json());

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index',
        { title: 'Home' })
});

app.get('/clientes', (req, res) => {
    const sql = `
        SELECT 
            c.id, c.nome, c.idade, c.email, c.telefone, 
            c.subscription_tier_id, c.ptrainer_id,
            s.name AS subscription_tier_name
        FROM clientes c
        LEFT JOIN subscription_tiers s ON c.subscription_tier_id = s.id
    `;
    db.query(sql, (err, results) => {
        if (err) { throw err; }
        res.render('clientes', { 
            title: 'Clientes', 
            clientes: results 
        });
    });
});

app.get('/clientes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
        if (err) { throw err; }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Cliente não encontrado');
        }
    });
});

app.post('/clientes', (req, res) => {
    const { nome, idade, email, telefone, subscription_tier_id } = req.body;
    if (!nome || !email || !subscription_tier_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const sql = 'INSERT INTO clientes (nome, idade, email, telefone, subscription_tier_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade || null, email, telefone || null, subscription_tier_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nome, idade, email, telefone, subscription_tier_id } = req.body;
    
    const sql = `
      UPDATE clientes 
      SET nome = ?, idade = ?, email = ?, telefone = ?, subscription_tier_id = ?
      WHERE id = ?
    `;
    
    db.query(sql, 
      [nome, idade, email, telefone, subscription_tier_id, id], 
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client updated successfully' });
    });
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM clientes WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    });
});


app.get('/funcionarios', (req, res) => {
    db.query('SELECT * FROM funcionarios', (err, results) => {
        if (err) { throw err; }
        res.render('funcionarios',
            { title: 'Funcionarios', funcionarios: results });
    });
});

app.get('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM funcionarios WHERE id = ?', [id], (err, results) => {
        if (err) { throw err; }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Funcionario não encontrado');
        }
    });
});

app.post('/funcionarios', (req, res) => {
    const { nome, idade, email, telefone, tipo, morada, codigo_postal } = req.body;
    const sql = 'INSERT INTO funcionarios (nome, idade, email, telefone, tipo, morada, codigo_postal) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, email, telefone, tipo, morada, codigo_postal], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade, email, telefone, tipo, morada, codigo_postal } = req.body;
    const sql = 'UPDATE funcionarios SET nome = ?, idade = ?, email = ?, telefone = ?, tipo = ?, morada = ?, codigo_postal = ? WHERE id = ?';
    db.query(sql, [nome, idade, email, telefone, tipo, morada, codigo_postal, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Funcionario atualizado com sucesso' });
        } else {
            res.status(404).send('Funcionario não encontrado');
        }
    });
});

app.delete('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM funcionarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Funcionario apagado com sucesso' });
        } else {
            res.status(404).send('Funcionario não encontrado');
        }
    });
});

app.get('/subscricoes', (req, res) => {
    db.query('SELECT * FROM subscription_tiers', (err, results) => { // Fixed table name
        if (err) { throw err; }
        res.render('subscriptions', { 
            title: 'Subscrições', 
            subscription_tiers: results 
        });
    });
});

app.get('/subscricoes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM subscription_tiers WHERE id = ?', [id], (err, results) => {
        if (err) { throw err; }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Tipo de subscrição não encontrada');
        }
    });
});

app.post('/subscricoes', (req, res) => {
    const { name, description, monthly_price, features } = req.body;
    const sql = 'INSERT INTO subscription_tiers (name, description, monthly_price, features) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, monthly_price, features], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/subscricoes/:id', (req, res) => {
    const id = req.params.id;
    const { name, description, monthly_price, features } = req.body;
    const sql = 'UPDATE subscription_tiers SET name = ?, description = ?, monthly_price = ?, features = ? WHERE id = ?';
    db.query(sql, [name, description, monthly_price, features, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Tipo de subscrição atualizada com sucesso' });
        } else {
            res.status(404).send('Tipo de subscrição não encontrada');
        }
    });
});

app.delete('/subscricoes/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM subscription_tiers WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Tipo de subscrição apagada com sucesso' });
        } else {
            res.status(404).send('Tipo de subscrição não encontrada');
        }
    });
});

// Rota para listar clientes com seus funcionarios ptrainers (STEP 3)
app.get('/ptrainers', (req, res) => {
    const sql = `
        SELECT 
            a.id as cliente_id,
            a.nome as cliente_nome,
            p.id as funcionario_id,
            p.nome as funcionario_nome,
            a.ptrainer_id
        FROM clientes a
        LEFT JOIN funcionarios p ON a.ptrainer_id = p.id
    `;
    
    // First get the clientes with their ptrainers
    db.query(sql, (err, clientResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao procurar clientes' });
        }
        
        // Then get all funcionarios for the dropdown
        db.query('SELECT id, nome FROM funcionarios', (err, funcionarioResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao procurar funcionarios' });
            }
            
            // Format the clientes data
            const formattedClientes = clientResults.map(row => ({
                id: row.cliente_id,
                nome: row.cliente_nome,
                ptrainer: row.funcionario_nome || "Sem personal trainer",
                ptrainer_id: row.funcionario_id || null
            }));
            
            res.render('ptrainers', {
                title: 'Clientes e Personal Trainers',
                clientes: formattedClientes,
                funcionarios: funcionarioResults  // Pass funcionarios to the template
            });
        });
    });
});

// Rota para associar/atualizar funcionario ptrainer
app.put('/clientes/:id/ptrainer', (req, res) => {
    const id = req.params.id;
    const { ptrainer_id } = req.body;  // Now we only need the ptrainer ID
    
    // First validate the funcionario exists if provided
    if (ptrainer_id) {
        db.query('SELECT id FROM funcionarios WHERE id = ?', [ptrainer_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao validar funcionario' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Funcionario não encontrado' });
            }
            
            updatePTrainer();
        });
    } else {
        updatePTrainer();
    }
    
    function updatePTrainer() {
        const sql = 'UPDATE clientes SET ptrainer_id = ? WHERE id = ?';
        db.query(sql, [ptrainer_id || null, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar personal trainer' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }
            
            res.json({ 
                message: 'Personal trainer atualizado com sucesso',
                cliente_id: id,
                ptrainer_id: ptrainer_id || null
            });
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});