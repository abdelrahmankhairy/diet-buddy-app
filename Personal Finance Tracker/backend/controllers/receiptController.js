const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { extractReceiptData } = require('../utils/ocrService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .pdf files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Note: PDF handling would require additional processing
    // For now, we'll focus on image files (jpg, png)
    if (req.file.mimetype === 'application/pdf') {
      // PDF would need to be converted to image first
      // For skeleton, we'll return a message
      await fs.unlink(filePath); // Clean up
      return res.status(400).json({
        error: 'PDF processing not yet implemented. Please upload an image file (JPG/PNG).'
      });
    }

    // Process receipt with OCR
    const extractedData = await extractReceiptData(filePath);

    // Clean up uploaded file after processing
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    if (!extractedData.success) {
      return res.status(500).json({
        error: extractedData.error || 'Failed to extract receipt data',
        rawText: extractedData.rawText || ''
      });
    }

    res.json({
      message: 'Receipt processed successfully',
      extractedData: {
        amount: extractedData.amount,
        tax: extractedData.tax,
        date: extractedData.date,
        location: extractedData.location,
        description: extractedData.description,
        items: extractedData.items,
        rawText: extractedData.rawText.substring(0, 500) // Limit raw text response
      }
    });
  } catch (error) {
    console.error('Upload receipt error:', error);

    // Clean up file on error
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file on error:', unlinkError);
      }
    }

    res.status(500).json({ error: 'Server error processing receipt' });
  }
};

module.exports = {
  uploadReceipt,
  uploadMiddleware: upload.single('receipt')
};
