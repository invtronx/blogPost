const express = require('express');

const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

/** Generic Routes **/

// GET: signup
router.get('/signup', authController.getSignup);
// POST: signup
router.post('/signup', authController.postSignup);

// GET: login
router.get('/login', authController.getLogin);
// POST: login
router.post('/login', authController.postLogin);

// GET: logout
router.get('/logout', authController.getLogout);
// POST: logout
router.post('/logout', authController.postLogout);

// GET: notifications
router.get('/notifications', notificationController.getNotification);

// GET: about
router.get('/about', homeController.getAbout);

// GET: homepage
router.get(/\/(home)?/, homeController.getHome);

module.exports = router;
