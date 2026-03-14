import express from 'express';
import * as analysisController from '../controllers/analysisController.js';

const router = express.Router();

router.post('/correlation-analysis', analysisController.correlationAnalysis);
router.post('/systematic-review', analysisController.systematicReview);
router.post('/meta-analysis', analysisController.metaAnalysis);

export default router;
