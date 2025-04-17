import express from 'express';
import mariadb, { PoolConnection } from 'mariadb';
import cors from 'cors';
import dotenv from 'dotenv';
import { databaseRouter } from './routes/database.routes';
import quizRouter from './routes/quiz';

dotenv.config();

const app = express();
const port = process.env.PORT || 31495;

// MariaDB 연결 풀 생성
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectionLimit: 5
});

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://www.nexus.ai.kr',
  'https://nexus.ai.kr',
  'https://web-sql-practice-m8o060qr089796e0.sel4.cloudtype.app'
];

// 미들웨어 설정
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// 라우트 설정
app.use('/api/databases', databaseRouter);
app.use('/api/quiz', quizRouter);

// 데이터베이스 연결 테스트
pool.getConnection()
  .then((conn: PoolConnection) => {
    console.log('MariaDB 연결 성공');
    conn.release();
  })
  .catch((err: Error) => {
    console.error('MariaDB 연결 실패:', err);
  });

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 