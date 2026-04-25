import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
// Import routers here
// app.use('/api/auth', authRouter);
// app.use('/api/notebooks', notebooksRouter);
// app.use('/api/chat', chatRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
