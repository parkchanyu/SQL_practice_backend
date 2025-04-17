import express from 'express';
import cors from 'cors';
import { queryRouter } from './routes/query.routes';
import { databaseRouter } from './routes/database.routes';
import quizRouter from './routes/quiz';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://www.nexus.ai.kr'
];

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

app.use('/api/databases', databaseRouter);
app.use('/api/quiz', quizRouter);

export default app; 