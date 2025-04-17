import express from 'express';
import { Database } from '../models/database.model';

const router = express.Router();

// 데이터베이스 생성
router.post('/', async (req, res) => {
  try {
    const { name, tables } = req.body;
    const database = new Database({ name, tables });
    await database.save();
    res.status(201).json(database);
  } catch (error) {
    res.status(400).json({ error: '데이터베이스 생성 실패' });
  }
});

// 데이터베이스 목록 조회
router.get('/', async (req, res) => {
  try {
    const databases = await Database.find();
    res.json(databases);
  } catch (error) {
    res.status(500).json({ error: '데이터베이스 조회 실패' });
  }
});

// 데이터베이스 삭제
router.delete('/:id', async (req, res) => {
  try {
    const database = await Database.findByIdAndDelete(req.params.id);
    if (!database) {
      return res.status(404).json({ error: '데이터베이스를 찾을 수 없습니다' });
    }
    res.json({ message: '데이터베이스가 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ error: '데이터베이스 삭제 실패' });
  }
});

export const databaseRouter = router; 