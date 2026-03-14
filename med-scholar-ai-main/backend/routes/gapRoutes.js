import express from 'express';
import * as gapController from '../controllers/gapController.js';

const router = express.Router();

router.post('/gap-analysis', gapController.findResearchGaps);

export default router;
