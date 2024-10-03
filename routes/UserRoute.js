const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

router.post('/signup', userController.signup);// http://localhost:3000/users
router.post('/login', userController.login);// http://localhost:3000/users
module.exports = router;