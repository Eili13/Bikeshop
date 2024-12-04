const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the upload directory (absolute path)
const uploadDir = path.join(__dirname, 'uploads/');

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the absolute path to the 'uploads' directory
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filenames by adding timestamp and original filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Allow the file
  } else {
    cb(new Error('Only image files are allowed'), false);  // Reject the file
  }
};

// Multer upload instance with limits and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB (optional)
});

module.exports = upload;
