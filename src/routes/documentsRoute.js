// Dans votre fichier de routes (documentRoutes.js)
const express = require('express');
const router = express.Router();
const documentsController = require('../controllers/documentsController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurer le stockage multer pour les documents
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/uploads/documents');
        
        // Créer le répertoire s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // Générer un nom unique basé sur le timestamp
        const uniqueSuffix = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    fileFilter: function(req, file, cb) {
        // Accepter tous les types de documents courants
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Le type de fichier n'est pas supporté. Types acceptés : images, PDF, documents Office, TXT."));
    }
});

// Routes
router.get('/documents', documentsController.getAllDocuments);
router.post('/documents/upload', upload.single('document'), documentsController.uploadDocument);
router.get('/documents/download/:id', documentsController.downloadDocument);
router.post('/documents/delete/:id', documentsController.deleteDocument);
router.get('/documents/vehicle/:vehicleId', documentsController.getDocumentsByVehicle);

module.exports = router;