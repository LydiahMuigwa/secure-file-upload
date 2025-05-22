const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const fileType = require('file-type');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

// Directories
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const TEMP_DIR = path.join(__dirname, 'temp_uploads');

// Whitelist of allowed MIME types
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'application/pdf': '.pdf'
};

// Logging function
const logUploadAttempt = (ip, status, filename, reason = '') => {
  const logLine = `[${new Date().toISOString()}] IP: ${ip} - ${status} - File: ${filename}${reason ? ' - ' + reason : ''}\n`;
  fs.appendFileSync('upload.log', logLine);
};

// Rate limiter: 5 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.redirect('/?status=error&message=Too%20many%20uploads%20from%20this%20IP,%20please%20try%20again%20later.');
  }
});

// Multer configuration (temporary storage)
const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    const tempName = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    cb(null, tempName);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

app.use(express.static('public'));

// Upload route
app.post('/upload', uploadLimiter, upload.single('uploaded_file'), async (req, res) => {
  const filePath = path.join(TEMP_DIR, req.file.filename);
  const buffer = fs.readFileSync(filePath);
  const detectedType = await fileType.fromBuffer(buffer);

  // MIME type validation
  if (!detectedType) {
    fs.unlinkSync(filePath);
    logUploadAttempt(req.ip, 'FAILED', req.file.originalname, 'Unknown or unreadable file format');
    return res.redirect('/?status=error&message=Unsupported%20or%20corrupted%20file');
  }

  if (!ALLOWED_TYPES[detectedType.mime]) {
    fs.unlinkSync(filePath);
    logUploadAttempt(req.ip, 'FAILED', req.file.originalname, 'Disallowed MIME type');
    return res.redirect('/?status=error&message=File%20type%20not%20allowed');
  }

  // Generate safe filename
  const safeFilename = crypto.randomBytes(16).toString('hex') + ALLOWED_TYPES[detectedType.mime];
  const finalPath = path.join(UPLOAD_DIR, safeFilename);

  // Move file
  fs.renameSync(filePath, finalPath);

  logUploadAttempt(req.ip, 'SUCCESS', req.file.originalname, `Saved as ${safeFilename}`);
  return res.redirect(`/?status=success&file=${safeFilename}`);
});

// 🔥 Global error handler for Multer file size errors
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.redirect('/?status=error&message=File%20is%20too%20large.%20Max%20size%20is%202MB');
  }

  console.error('Unexpected error:', err);
  return res.redirect('/?status=error&message=Unexpected%20server%20error.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
