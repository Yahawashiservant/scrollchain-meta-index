import express from 'express';
import cors from 'cors';
import { codexRouter } from './routes/codexRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/codex', codexRouter);

const PORT = process.env.PORT || 3690;
app.listen(PORT, () => {
  console.log(`🧭 Codex API listening on port ${PORT}`);
});
