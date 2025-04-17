import express from 'express';
import cors from 'cors';
import tablesRouter from './routes/tables';
import databasesRouter from './routes/databases';
import quizRouter from './routes/quiz';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tables', tablesRouter);
app.use('/api/databases', databasesRouter);
app.use('/api', quizRouter);

export default app; 