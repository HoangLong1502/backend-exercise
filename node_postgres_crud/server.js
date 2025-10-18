const express = require('express');
const pool = require('./index');
const bcrypt = require('bcryptjs');
const { createUser, READUser, updateUser, deleteUser } = require('./userQueries');

const app = express();
app.use(express.json());


app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        
        const exists = await pool.query('SELECT id FROM users WHERE username = $1', [email]);
        if (exists.rows.length > 0) {
            return res.status(409).json({ error: 'email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const insertQuery = 'INSERT INTO users (username, password, avatar) VALUES ($1, $2, $3) RETURNING *';
        const values = [email, hashed, null];
        const result = await pool.query(insertQuery, values);

        const user = result.rows[0];
        delete user.password;

        return res.status(201).json({ user });
    } catch (err) {
        console.error('register error', err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

app.post('/users', async (req, res) => {
    const { id, username, password, avatar } = req.body;
    try {
        const user = await createUser(id, username, password, avatar);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await READUser(id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, avatar } = req.body;
    try {
        const user = await updateUser(id, username, password, avatar);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await deleteUser(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;
