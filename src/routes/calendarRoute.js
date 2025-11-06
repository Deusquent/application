const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authguardUser = require('../services/authguardUser');

// Route principale pour afficher la page du calendrier
router.get('/calendar', authguardUser, calendarController.getCalendarData);
router.post('/calendar/create', authguardUser, calendarController.createEvent);
router.get('/calendar/events', authguardUser, calendarController.getEvents);
router.post('/calendar/delete/:id', authguardUser, calendarController.deleteEvent);

module.exports = router;