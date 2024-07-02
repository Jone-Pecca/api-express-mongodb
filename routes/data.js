import { Router } from 'express';
const router = Router();
import multer from 'multer';
import csvParser from 'csv-parser';
import { write } from 'fast-csv';
import { createReadStream, unlinkSync, createWriteStream } from 'fs';
import { join } from 'path';
import { readFile, utils, writeFile } from 'xlsx';
import { insertMany, find } from '../models/users.js';

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Import CSV file
router.post('/import/csv', upload.single('file'), (req, res) => {
  const results = [];
  createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await insertMany(results);
        res.status(200).json({ message: 'CSV data imported successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      } finally {
        unlinkSync(req.file.path); // Remove file after processing
      }
    });
});

// Export to CSV file
router.get('/export/csv', async (req, res) => {
  try {
    const users = await find().lean();
    const ws = createWriteStream(join(__dirname, '../exports/users.csv'));
    write(users, { headers: true })
      .on('finish', () => {
        res.download(join(__dirname, '../exports/users.csv'));
      })
      .pipe(ws);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Import XLSX file
router.post('/import/xlsx', upload.single('file'), (req, res) => {
  const workbook = readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = utils.sheet_to_json(workbook.Sheets[sheetName]);

  insertMany(worksheet)
    .then(() => {
      res.status(200).json({ message: 'XLSX data imported successfully' });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    })
    .finally(() => {
      unlinkSync(req.file.path); // Remove file after processing
    });
});

// Export to XLSX file
router.get('/export/xlsx', async (req, res) => {
  try {
    const users = await find().lean();
    const worksheet = utils.json_to_sheet(users);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Users');

    const filePath = join(__dirname, '../exports/users.xlsx');
    writeFile(workbook, filePath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
