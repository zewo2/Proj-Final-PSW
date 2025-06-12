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
            res.status(404).send('cliente não encontrado');
        }
    });
});

app.post('/clientes', (req, res) => {
    const { nome, idade, morada, codigo_postal, email } = req.body;
    const sql = 'INSERT INTO clientes (nome, idade, morada, codigo_postal, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, morada, codigo_postal, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/clientes/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade, morada, codigo_postal, email } = req.body;
    const sql = 'UPDATE clientes SET nome = ?, idade = ?, morada = ?, codigo_postal = ?, email = ? WHERE id = ?';
    db.query(sql, [nome, idade, morada, codigo_postal, email, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'cliente atualizado com sucesso' });
        } else {
            res.status(404).send('cliente não encontrado');
        }
    });
});

app.delete('/clientes/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM clientes WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'cliente deletado com sucesso' });
        } else {
            res.status(404).send('cliente não encontrado');
        }
    });
});


app.get('/funcionarios', (req, res) => {
    db.query('SELECT * FROM funcionarios', (err, results) => {
        if (err) { throw err; }
        res.render('funcionarios',
            { title: 'funcionarios', funcionarios: results });
    });
});

app.get('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM funcionarios WHERE id = ?', [id], (err, results) => {
        if (err) { throw err; }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('funcionario não encontrado');
        }
    });
});

app.post('/funcionarios', (req, res) => {
    const { nome, idade, disciplina, morada, codigo_postal } = req.body;
    const sql = 'INSERT INTO funcionarios (nome, idade, disciplina, morada, codigo_postal) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, idade, disciplina, morada, codigo_postal], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, ...req.body });
    });
});

app.put('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    const { nome, idade, disciplina, morada, codigo_postal } = req.body;
    const sql = 'UPDATE funcionarios SET nome = ?, idade = ?, disciplina = ?, morada = ?, codigo_postal = ? WHERE id = ?';
    db.query(sql, [nome, idade, disciplina, morada, codigo_postal, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'funcionario atualizado com sucesso' });
        } else {
            res.status(404).send('funcionario não encontrado');
        }
    });
});

app.delete('/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM funcionarios WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows > 0) {
            res.json({ message: 'funcionario apagado com sucesso' });
        } else {
            res.status(404).send('funcionario não encontrado');
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
            return res.status(500).json({ error: 'Erro ao buscar clientes' });
        }
        
        // Format the response to show "Sem orientador" when no advisor is assigned
        const formattedResults = results.map(row => ({
            id: row.cliente_id,
            nome: row.cliente_nome,
            orientador: row.funcionario_nome || "Sem personal trainer",
            orientador_id: row.funcionario_id || null
        }));
        
        res.render('ptrainers',
            { title: 'clientes e ptrainers', clientes: formattedResults});
    });
});

// Rota para associar/atualizar funcionario orientador (STEP 2)
app.put('/clientes/:id/orientador', (req, res) => {
    const id = req.params.id;
    const { orientador_id } = req.body;  // Now we only need the advisor ID
    
    // First validate the funcionario exists if provided
    if (orientador_id) {
        db.query('SELECT id FROM funcionarios WHERE id = ?', [orientador_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao validar funcionario' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'funcionario não encontrado' });
            }
            
            updateStudentAdvisor();
        });
    } else {
        updateStudentAdvisor();
    }
    
    function updateStudentAdvisor() {
        const sql = 'UPDATE clientes SET orientador_id = ? WHERE id = ?';
        db.query(sql, [orientador_id || null, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao atualizar orientador' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'cliente não encontrado' });
            }
            
            res.json({ 
                message: 'Orientador atualizado com sucesso',
                cliente_id: id,
                orientador_id: orientador_id || null
            });
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});