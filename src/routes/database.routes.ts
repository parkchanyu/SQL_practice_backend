import express, { Request, Response } from 'express';
import mariadb, { PoolConnection } from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// MariaDB 연결 풀 생성
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectionLimit: 5
});

// 테이블 목록 조회
router.get('/tables', async (req, res) => {
  try {
    const conn = await pool.getConnection() as PoolConnection;
    const rows = await conn.query('SHOW TABLES');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('테이블 목록 조회 실패:', error);
    res.status(500).json({ error: '테이블 목록을 가져오는데 실패했습니다' });
  }
});

// 테이블 데이터 조회
router.get('/tables/:tableName/data', async (req, res) => {
  const { tableName } = req.params;
  try {
    const conn = await pool.getConnection() as PoolConnection;
    try {
      const rows = await conn.query(`SELECT * FROM ${tableName}`);
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('테이블 데이터 조회 실패:', error);
    res.status(500).json({ error: '테이블 데이터를 가져오는데 실패했습니다' });
  }
});

// 테이블 구조 조회
router.get('/tables/:tableName/structure', async (req, res) => {
  const { tableName } = req.params;
  try {
    const conn = await pool.getConnection() as PoolConnection;
    try {
      const rows = await conn.query(`DESCRIBE ${tableName}`);
      res.json(rows);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('테이블 구조 조회 실패:', error);
    res.status(500).json({ error: '테이블 구조를 가져오는데 실패했습니다' });
  }
});

// 테이블 생성
router.post('/tables', async (req, res) => {
  const { tableName, columns } = req.body;

  if (!tableName || !columns || !Array.isArray(columns)) {
    return res.status(400).json({ error: '테이블 이름과 컬럼 정보가 필요합니다' });
  }

  try {
    const conn = await pool.getConnection() as PoolConnection;
    
    const columnDefinitions = columns.map(col => 
      `${col.name} ${col.type}${col.nullable ? '' : ' NOT NULL'}${col.primary ? ' PRIMARY KEY' : ''}`
    ).join(', ');

    await conn.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`);
    conn.release();
    res.status(201).json({ message: '테이블이 생성되었습니다' });
  } catch (error) {
    console.error('테이블 생성 실패:', error);
    res.status(500).json({ error: '테이블 생성에 실패했습니다' });
  }
});

// 테이블에 데이터 추가
router.post('/tables/:tableName/data', async (req, res) => {
  const { tableName } = req.params;
  const { data } = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: '데이터가 필요합니다' });
  }

  try {
    const conn = await pool.getConnection() as PoolConnection;
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
      
      await conn.query(query, values);
      res.status(201).json({ message: '데이터가 성공적으로 추가되었습니다' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('데이터 추가 실패:', error);
    res.status(500).json({ error: '데이터 추가에 실패했습니다' });
  }
});

// SQL 쿼리 실행
router.post('/query', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'SQL 쿼리가 필요합니다' });
  }

  try {
    const conn = await pool.getConnection() as PoolConnection;
    const result = await conn.query(query);
    conn.release();
    res.json(result);
  } catch (error) {
    console.error('쿼리 실행 실패:', error);
    res.status(500).json({ error: '쿼리 실행에 실패했습니다' });
  }
});

// GET /api/databases
router.get('/databases', async (req: Request, res: Response) => {
  try {
    const conn = await pool.getConnection() as PoolConnection;
    const databases = await conn.query('SHOW DATABASES');
    conn.release();
    res.json(databases);
  } catch (error) {
    console.error('데이터베이스 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export const databaseRouter = router; 