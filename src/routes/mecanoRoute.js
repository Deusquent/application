const express = require('express');
const router = express.Router();
const mecanoController = require('../controllers/mecanoController');
const authguard = require('../services/authguardUser');

router.get('/addMecano', mecanoController.getInscription);
router.post('/addMecano', mecanoController.postInscription);
router.get('/registerMecano', mecanoController.getregisterMecano);

module.exports = router;