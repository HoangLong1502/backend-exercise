const pool = require('./index');
const action = 'update';   //làm từng cái mệt quá để cái của nợ này muốn làm gì thì làm cho nhanh =))
async function main() {
    try {
        if (action === 'create') {
            const user = await createUser(106, 'user6', 'pass6', 'avatar6.png');
            console.log('User vừa tạo:', user);
        } else if (action === 'read') {
            const user = await READUser(106);
            console.log('User vừa đọc:', user);
        } else if (action === 'update') {
            const user = await updateUser(106, 'user6_updated', 'newpass6', 'newavatar6.png');
            console.log('User sau khi update:', user);
        } else if (action === 'delete') {
            const user = await deleteUser(106);
            console.log('User đã xóa:', user);
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