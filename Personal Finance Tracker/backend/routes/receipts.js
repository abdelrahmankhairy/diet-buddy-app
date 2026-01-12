const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { uploadReceipt, uploadMiddleware } = require('../controllers/receiptController');

// All routes require authentication
router.use(authMiddleware);

router.post('/upload', uploadMiddleware, uploadReceipt);

module.exports = router;
