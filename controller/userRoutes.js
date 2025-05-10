const express = require('express');
const router = express.Router();
const {login} = require('./userController');

router.post('/login', login);

module.exports = router;