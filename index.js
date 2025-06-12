// Sistema de Gestão Ginásio - Backend

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const db = require('./connection.js'); //This is the same as making a new connection

// Middleware to parse JSON bodies
app.use(express.json());

app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index',
        { title: 'Home' })
});

app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, results) => {
        if (err) { throw err; }
        res.render('clientes',
            { title: 'clientes', clientes: results });
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
    const { nome, idade, email, telefone, subscription_tier } = req.body;
    const sql = 'INSERT INTO clientes (nome, idade, email, telefone, subscription_tier) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, email, telefone, subscription_tier, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/clientes/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade, email, telefone, subscription_tier } = req.body;
    const sql = 'UPDATE clientes SET nome = ?, idade = ?, email = ?, telefone = ?, subscription_tier = ? WHERE id = ?';
    db.query(sql, [nome, idade, email, telefone, subscription_tier, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cliente atualizado com sucesso' });
        } else {
            res.status(404).send('Cliente não encontrado');
        }
    });
});

app.delete('/clientes/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'Cliente apagado com sucesso' });
        } else {
            res.status(404).send('Cliente não encontrado');
        }
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
    db.query(sql, [nome, idade, email, telefone, tipo, morada, codigo_postal], (err, result) => {
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

// Rota para listar clientes com seus funcionarios ptrainers (STEP 3)
app.get('/ptrainers', (req, res) => {
    const sql = `
        SELECT 
            a.id as cliente_id,
            a.nome as cliente_nome,
            p.id as funcionario_id,
            p.nome as funcionario_nome
        FROM clientes a
        LEFT JOIN funcionarios p ON a.ptrainer_id = p.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao procurar clientes' });
        }
        
        // Format the response to show "Sem ptrainer" when no advisor is assigned
        const formattedResults = results.map(row => ({
            id: row.cliente_id,
            nome: row.cliente_nome,
            ptrainer: row.funcionario_nome || "Sem personal trainer",
            ptrainer_id: row.funcionario_id || null
        }));
        
        res.render('ptrainers',
            { title: 'Clientes e ptrainers', clientes: formattedResults});
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
            
            updateStudentAdvisor();
        });
    } else {
        updateStudentAdvisor();
    }
    
    function updateStudentAdvisor() {
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