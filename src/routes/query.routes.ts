import express from 'express';
import { Database } from '../models/database.model';

const router = express.Router();

// 쿼리 실행
router.post('/', async (req, res) => {
  try {
    const { databaseId, query } = req.body;
    const database = await Database.findById(databaseId);
    
    if (!database) {
      return res.status(404).json({ error: '데이터베이스를 찾을 수 없습니다' });
    }

    // TODO: 쿼리 실행 로직 구현
    // 임시 응답
    res.json({
      success: true,
      message: '쿼리가 성공적으로 실행되었습니다',
      result: []
    });
  } catch (error) {
    res.status(500).json({ error: '쿼리 실행 실패' });
  }
});

// 쿼리 실행 기록 조회
router.get('/history', async (req, res) => {
  try {
    // TODO: 쿼리 실행 기록 조회 로직 구현
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: '쿼리 기록 조회 실패' });
  }
});

export const queryRouter = router; 