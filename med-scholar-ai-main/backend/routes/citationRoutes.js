import express from 'express';
import * as citationController from '../controllers/citationController.js';

const router = express.Router();

router.post('/citation-check', citationController.verifyCitations);

export default router;
