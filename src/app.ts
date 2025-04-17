import express from 'express';
import cors from 'cors';
import { queryRouter } from './routes/query.routes';
import { databaseRouter } from './routes/database.routes';
import quizRouter from './routes/quiz';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tables', queryRouter);
app.use('/api/databases', databaseRouter);
app.use('/api/quiz', quizRouter);

export default app; 