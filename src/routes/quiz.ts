import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { pool } from '../db';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/generate-quiz', async (req, res) => {
  try {
    const { tables } = req.body;

    // 테이블 정보를 프롬프트에 포함
    const tablesInfo = tables.map((table: any) => 
      `테이블명: ${table.name}\n컬럼: ${table.columns.map((col: any) => `${col.name}(${col.type})`).join(', ')}`
    ).join('\n\n');

    const prompt = `다음 테이블 정보를 바탕으로 SELECT 문만을 사용하는 SQL 퀴즈를 생성해주세요.
테이블 정보:
${tablesInfo}

퀴즈는 다음 형식으로 JSON으로 응답해주세요:
{
  "id": "고유ID",
  "question": "문제 설명",
  "answer": "정답 SQL 쿼리",
  "hint": "힌트"
}

SELECT 문만 사용해야 하며, JOIN, 서브쿼리 등 복잡한 쿼리는 사용하지 마세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a SQL quiz generator that creates simple SELECT query questions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const quiz = JSON.parse(completion.choices[0].message?.content || '{}');
    res.json(quiz);
  } catch (error) {
    console.error('퀴즈 생성 중 오류 발생:', error);
    res.status(500).json({ error: '퀴즈 생성에 실패했습니다.' });
  }
});

// GET /api/quiz
router.get('/', async (req: Request, res: Response) => {
  try {
    // 임시로 더미 데이터를 반환
    const quizzes = [
      {
        id: 1,
        question: 'SELECT 문을 사용하여 모든 고객의 이름을 조회하시오.',
        answer: 'SELECT name FROM customers;',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'WHERE 절을 사용하여 나이가 30세 이상인 고객을 조회하시오.',
        answer: 'SELECT * FROM customers WHERE age >= 30;',
        difficulty: 'medium'
      }
    ];
    res.json(quizzes);
  } catch (error) {
    console.error('퀴즈 목록 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router; 