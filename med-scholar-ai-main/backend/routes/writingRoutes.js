import express from 'express';
import * as writingController from '../controllers/writingController.js';

const router = express.Router();

router.post('/grammar-check', writingController.grammarCheck);
router.post('/plagiarism-check', writingController.plagiarismCheck);
router.post('/ai-detection', writingController.aiDetection);
router.post('/humanize-text', writingController.humanizeText);

export default router;
