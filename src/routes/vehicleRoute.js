const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const multer = require('multer');
const path = require('path');
const authguardUser = require('../services/authguardUser'); // Assure-toi que ce middleware existe

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/vehicles'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Protège les routes avec authGuardUser
router.post('/vehicle/add', authguardUser, upload.single('photo'), vehicleController.postAddVehicle);
router.get('/addVoiture', authguardUser, vehicleController.getAddVehicle);
router.get('/vehicles', authguardUser, vehicleController.getVehicles);
router.get('/mes-vehicules', authguardUser, vehicleController.getAllUserVehicles);
router.get('/vehicule/:id', authguardUser, vehicleController.getVehicleDetail);
router.post('/delete-vehicule/:id', authguardUser, vehicleController.deleteVehicle);

module.exports = router;