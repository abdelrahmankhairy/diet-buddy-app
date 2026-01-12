const Tesseract = require('tesseract.js');
const fs = require('fs').promises;
const path = require('path');

/**
 * Extract information from receipt image using OCR
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Promise<Object>} Extracted receipt data
 */
async function extractReceiptData(imagePath) {
  try {
    // Perform OCR on the image
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => {
          // Optional: log OCR progress
          if (m.status === 'recognizing text') {
            // Can log progress if needed
          }
        }
      }
    );

    // Parse the extracted text to find relevant information
    const extractedData = parseReceiptText(text);

    return {
      success: true,
      rawText: text,
      ...extractedData
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      success: false,
      error: 'Failed to process receipt image',
      rawText: ''
    };
  }
}

/**
 * Parse OCR text to extract receipt information
 * @param {string} text - Raw OCR text
 * @returns {Object} Parsed receipt data
 */
function parseReceiptText(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  let amount = null;
  let tax = null;
  let date = null;
  let location = null;
  let items = [];

  // Common patterns for finding amounts (USD, EUR, etc.)
  const amountPattern = /(?:total|amount|sum|subtotal|grand\s*total)[\s:]*\$?([\d,]+\.?\d{0,2})/i;
  const taxPattern = /(?:tax|vat|gst)[\s:]*\$?([\d,]+\.?\d{0,2})/i;
  const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/;
  const currencyPattern = /\$?([\d,]+\.\d{2})/g;

  // Find total amount (usually the largest number or last amount)
  const amounts = [];
  let match;
  while ((match = currencyPattern.exec(text)) !== null) {
    amounts.push(parseFloat(match[1].replace(/,/g, '')));
  }

  if (amounts.length > 0) {
    // Assume the largest amount is the total
    amount = Math.max(...amounts);

    // Second largest might be subtotal, tax could be difference
    if (amounts.length > 1) {
      const sortedAmounts = amounts.sort((a, b) => b - a);
      const subtotal = sortedAmounts[1];
      tax = amount - subtotal;
      if (tax < 0) tax = null; // Invalid calculation
    }
  }

  // Try to find amount using pattern
  for (const line of lines) {
    const amountMatch = line.match(amountPattern);
    if (amountMatch && !amount) {
      amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    const taxMatch = line.match(taxPattern);
    if (taxMatch && !tax) {
      tax = parseFloat(taxMatch[1].replace(/,/g, ''));
    }

    // Look for date
    const dateMatch = line.match(datePattern);
    if (dateMatch && !date) {
      date = dateMatch[1];
    }

    // Location is often at the top or bottom, or contains keywords
    if ((line.includes('Inc') || line.includes('LLC') || line.includes('Store') ||
         line.includes('Restaurant') || line.includes('Market')) && !location) {
      location = line;
    }
  }

  // If location not found, use first few non-numeric lines
  if (!location && lines.length > 0) {
    const firstLines = lines.slice(0, 3).filter(line => !/\d/.test(line));
    if (firstLines.length > 0) {
      location = firstLines[0];
    }
  }

  // Extract items (lines with amounts that aren't totals)
  lines.forEach((line, index) => {
    const itemMatch = line.match(/^(.+?)\s+\$?([\d,]+\.\d{2})$/);
    if (itemMatch && index < lines.length - 3) { // Usually items are before totals
      items.push({
        name: itemMatch[1].trim(),
        price: parseFloat(itemMatch[2].replace(/,/g, ''))
      });
    }
  });

  return {
    amount: amount || null,
    tax: tax || null,
    date: date || null,
    location: location || null,
    items: items.length > 0 ? items : null,
    description: items.length > 0 ? items.map(i => i.name).join(', ') : null
  };
}

module.exports = {
  extractReceiptData
};
