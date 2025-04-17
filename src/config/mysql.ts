import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const connection = mysql.createPool({
  host: process.env.MARIADB_HOST || 'localhost',
  port: Number(process.env.MARIADB_PORT) || 3306,
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'sql_practice'
}); 