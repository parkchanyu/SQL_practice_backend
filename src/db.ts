import mongoose from 'mongoose';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sql-practice';
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

// MariaDB 연결 풀 생성
export const pool = mysql.createPool({
  host: process.env.MARIADB_HOST || 'localhost',
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = async () => {
  try {
    const uri = MONGODB_USERNAME && MONGODB_PASSWORD
      ? `${MONGODB_URI}/${MONGODB_DB_NAME}?authSource=admin`
      : `${MONGODB_URI}/${MONGODB_DB_NAME}`;

    const options = MONGODB_USERNAME && MONGODB_PASSWORD
      ? {
          user: MONGODB_USERNAME,
          pass: MONGODB_PASSWORD,
        }
      : {};

    await mongoose.connect(uri, options);
    console.log('MongoDB 연결 성공');

    // MariaDB 연결 테스트
    await pool.getConnection();
    console.log('MariaDB 연결 성공');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};

export default connectDB; 