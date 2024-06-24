const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fastCsv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const User = require('../models/User');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Import CSV file
router.post('/import/csv', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await User.insertMany(results);
        res.status(200).json({ message: 'CSV data imported successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      } finally {
        fs.unlinkSync(req.file.path); // Remove file after processing
      }
    });
});

// Export to CSV file
router.get('/export/csv', async (req, res) => {
  try {
    const users = await User.find().lean();
    const ws = fs.createWriteStream(path.join(__dirname, '../exports/users.csv'));
    fastCsv
      .write(users, { headers: true })
      .on('finish', () => {
        res.download(path.join(__dirname, '../exports/users.csv'));
      })
      .pipe(ws);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Import XLSX file
router.post('/import/xlsx', upload.single('file'), (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  User.insertMany(worksheet)
    .then(() => {
      res.status(200).json({ message: 'XLSX data imported successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    })
    .finally(() => {
      fs.unlinkSync(req.file.path); // Remove file after processing
    });
});

// Export to XLSX file
router.get('/export/xlsx', async (req, res) => {
  try {
    const users = await User.find().lean();
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const filePath = path.join(__dirname, '../exports/users.xlsx');
    XLSX.writeFile(workbook, filePath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
