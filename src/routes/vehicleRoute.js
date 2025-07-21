const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const multer = require('multer');
const path = require('path');

// Configure Multer pour l'upload de photo
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/vehicles'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/addVoiture', vehicleController.getAddVehicle);
router.post('/addVoiture', upload.single('photo'), vehicleController.postAddVehicle);

module.exports = router;