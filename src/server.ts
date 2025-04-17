import express from 'express';
import mariadb from 'mariadb';
import cors from 'cors';
import dotenv from 'dotenv';
import databaseRoutes from './routes/databaseRoutes';
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

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api', databaseRoutes);
app.use('/api/quiz', quizRouter);

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(conn => {
    console.log('MariaDB 연결 성공');
    conn.release();
  })
  .catch(err => {
    console.error('MariaDB 연결 실패:', err);
  });

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 