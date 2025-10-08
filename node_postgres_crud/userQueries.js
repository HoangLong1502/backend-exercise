const pool = require('./index');
const action = 'read'; 

// Định nghĩa hàm tạo user
async function createUser(id, username, password, avatar) {
    const query = 'INSERT INTO users (id, username, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [id, username, password, avatar];
    const res = await pool.query(query, values);
    return res.rows[0];
}

// Định nghĩa hàm đọc user
async function READUser(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rows[0];
}

// Định nghĩa hàm update user
async function updateUser(id, username, password, avatar) {
    const query = 'UPDATE users SET username = $2, password = $3, avatar = $4 WHERE id = $1 RETURNING *';
    const values = [id, username, password, avatar];
    const res = await pool.query(query, values);
    return res.rows[0];
}

// Định nghĩa hàm delete user
async function deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    const res = await pool.query(query, values);
    return res.rows[0];
}

async function main() {
    try {
        if (action === 'create') {
            const user = await createUser(107, 'user8', 'pass8', 'avatar8.png');
            console.log(user);
        } else if (action === 'read') {
            const user = await READUser(103);
            console.log(user);
        } else if (action === 'update') {
            const user = await updateUser(104, 'nguyen van a', '123', 'newavatar6.png');
            console.log(user);
        } else if (action === 'delete') {
            const user = await deleteUser(106);
            console.log(user);
        } else {
            console.log('Không có thao tác phù hợp!');
        }
    } catch (err) {
        console.error('Lỗi:', err);
    } finally {
        await pool.end();
    }
}

main();