const pool = require('./index');

async function createUser(id,username, password, avatar) {
    const query = 'INSERT INTO users (id, username, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [id, username, password, avatar];
    const res = await pool.query(query, values);
    return res.rows[0];     
}

async function updateUser(id, username, password, avatar) {
    const query = 'UPDATE users SET username = $2, password = $3, avatar = $4 WHERE id = $1 RETURNING *';
    const values = [id, username, password, avatar];
    const res = await pool.query(query, values);
    return res.rows[0];
}
async function deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rows[0];
}
async function READUser(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rows[0];
}
// ...existing code...
async function main() {
    try {
        const user = await createUser(100, 'TestUser', 'testpass', 'testavatar.png');
        console.log('User vừa tạo:', user);
    } catch (err) {
        console.error('Lỗi:', err); // Sửa lại dòng này để log toàn bộ lỗi
    } finally {
        await pool.end();
    }
}
main();
