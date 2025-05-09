const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/chatbox');
    console.log('MongoDB connected');
  } 
  catch(err) {
    console.error('MongoDB failed to connect:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;