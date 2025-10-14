const express = require('express');
const { createUser, READUser, updateUser, deleteUser } = require('./userquery');

const app = express();
app.use(express.json());

// CREATE
app.post('/users', async (req, res) => {
    const { id, username, password, avatar } = req.body;
    try {
        const user = await createUser(id, username, password, avatar);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await READUser(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
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

// DELETE
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await deleteUser(id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
