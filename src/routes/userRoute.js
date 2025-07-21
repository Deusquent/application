const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authguardUser = require('../../services/authguardUser');

router.get('/inscription', userController.getInscription);
router.post('/inscription', userController.postInscription);
router.get('/registerUser', userController.getregisterUser);

module.exports = router;