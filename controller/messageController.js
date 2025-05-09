const message = require('../model/message');

exports.createmessage = async (req, res) => {
  try {
    const {content} = req.body;

    if(!content || content.trim() === '') {
      return res.status(400).json({error: 'Content is required'});
    }

    const val = new message({content});
    await val.save();

    res.status(201).json({val: 'Message saved', data: val});
  } 
  catch(err) {
    console.error('Error saving message:', err);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.getallmessages = async (req, res) => {
  try {
    const val = await message.find().sort({createdAt: 1});
    res.status(200).json(val);
  } 
  catch(err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({error: 'Failed to fetch messages'});
  }
};