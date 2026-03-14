import express from 'express';
import * as methodologyController from '../controllers/methodologyController.js';

const router = express.Router();

router.post('/generate-methodology', methodologyController.generateMethodology);

export default router;
