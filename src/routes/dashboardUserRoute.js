const express = require('express');
const router = express.Router();
const dashboardUserController = require('../controllers/dashboardUserController');
const authguardUser = require('../../services/authguardUser');

router.get('/dashboardUser', authguardUser, dashboardUserController.getDashboardUser);



module.exports = router;