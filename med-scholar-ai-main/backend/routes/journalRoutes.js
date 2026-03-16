import express from 'express';
import * as journalController from '../controllers/journalController.js';

const router = express.Router();

router.post('/journal-recommendations', journalController.recommendJournals);

export default router;
