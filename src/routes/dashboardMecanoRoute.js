const express = require('express');
const router = express.Router();
const dashboardMecanoController = require('../controllers/dashboardMecanoController');
const authguardMecano = require('../services/authguardMecano');


router.get('/dashboardMecano', authguardMecano, dashboardMecanoController.getDashboardMecano);


module.exports = router;