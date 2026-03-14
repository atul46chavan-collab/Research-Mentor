import express from 'express';
import * as literatureController from '../controllers/literatureController.js';

const router = express.Router();

router.post('/literature-review', literatureController.generateLiteratureReview);

export default router;
