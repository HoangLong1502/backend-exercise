const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5435,
  user: 'postgres',
  password: '123456',
  database: 'projectb_db',
});

module.exports = pool;