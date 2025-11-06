const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const authguardUser = require('../services/authguardUser');
const authguardMecano = require('../services/authguardMecano');

router.get('/login', loginController.getLogin);
router.post('/login', loginController.postLogin);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});



module.exports = router;