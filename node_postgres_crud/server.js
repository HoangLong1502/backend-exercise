require('dotenv').config();

const express = require('express');
const pool = require('./index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, READUser, updateUser, deleteUser } = require('./userQueries');

const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(express.json());

//middleware
//explain: when user send register or Login request server generate token 
//header Authorization : Bearer <token> means the token that server generated will split into 2 string
// keep the 2nd string to verify the user 
// if the token is valid, allow to access
    //id we get user id then query user info from db and stored in req.user
// else return error message (403 invalid token or 401 token required or 404 token not found )

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await pool.query('SELECT id, username, avatar FROM users WHERE id = $1', [decoded.userId]);
    
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};


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

        const insertQuery = 'INSERT INTO users (username, password, avatar, salt) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [email, hashed, null, salt];
        const result = await pool.query(insertQuery, values);

        const user = result.rows[0];
        delete user.password;
        delete user.salt;

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        return res.status(201).json({ user, token });
    } catch (err) {
        console.error('register error', err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        delete user.password;
        delete user.salt;

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

        return res.json({ user, token });
    } catch (err) {
        console.error('login error', err);
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
app.get('/me', authenticateToken, async (req, res) => {
    // req.user is already set by the authenticateToken middleware
    res.json({ user: req.user });
});

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;
