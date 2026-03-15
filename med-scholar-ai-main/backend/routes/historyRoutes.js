import express from 'express';
import * as historyController from '../controllers/historyController.js';

const router = express.Router();

router.post('/history', historyController.saveSearch);
router.get('/history', historyController.getHistory);
router.delete('/history', historyController.deleteHistory);

export default router;
