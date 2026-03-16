import dotenv from 'dotenv';
dotenv.config();

import './database.js';

import express from 'express';
import cors from 'cors';

// Import Routes
import paperRoutes from './routes/paperRoutes.js';
import literatureRoutes from './routes/literatureRoutes.js';
import gapRoutes from './routes/gapRoutes.js';
import methodologyRoutes from './routes/methodologyRoutes.js';
import citationRoutes from './routes/citationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import writingRoutes from './routes/writingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import journalRoutes from './routes/journalRoutes.js';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.send('Academic Research Mentor API is running...');
});

// API Routes
app.use('/api', paperRoutes);
app.use('/api', literatureRoutes);
app.use('/api', gapRoutes);
app.use('/api', methodologyRoutes);
app.use('/api', citationRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', analysisRoutes);
app.use('/api', writingRoutes);
app.use('/api', chatRoutes);
app.use('/api', historyRoutes);
app.use('/api', journalRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Node server is running on port ${PORT}`);
});
