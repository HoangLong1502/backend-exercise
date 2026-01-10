# Cấu hình Environment Variables

Tạo file `.env` trong thư mục `node_postgres_crud` với nội dung sau:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5435
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=projectb_db

# JWT Secret (use a strong random string in production)
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# Server Port
PORT=3000
```

**QUAN TRỌNG:**
- Đổi `DB_PASSWORD` thành mật khẩu mạnh
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên mạnh (ít nhất 32 ký tự)
- KHÔNG commit file `.env` vào git

Sau đó chạy:
```bash
docker compose up -d
```
