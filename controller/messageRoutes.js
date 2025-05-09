const express = require('express');
const router = express.Router();
const {createmessage, getallmessages} = require('./messageController');

router.post('/messages', createmessage);
router.get('/messages', getallmessages);

module.exports = router;
