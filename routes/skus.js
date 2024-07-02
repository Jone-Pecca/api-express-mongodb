import express from 'express';
import Sku from '../models/skus.js';
import * as SkuController from '../controllers/skus.js'

const router = express.Router();

router.get('/', SkuController.findAll);
// router.post('/', ... )

export default router;
