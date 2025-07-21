const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentsController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/documents'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
router.get('/documents', documentController.getAllDocuments);
router.get('/documents/:vehicleId', documentController.getDocuments);
router.post('/documents/upload', upload.single('document'), documentController.uploadDocument);


module.exports = router;