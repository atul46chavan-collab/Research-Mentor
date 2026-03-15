import express from 'express';
import * as paperController from '../controllers/paperController.js';

const router = express.Router();

router.get('/papers', paperController.getPapers);
router.post('/paper-summary', paperController.summarizePaper);
router.post('/trend-summary', paperController.getTrendSummary);
router.post('/extract-paper-insights', paperController.extractPaperInsights);

export default router;
