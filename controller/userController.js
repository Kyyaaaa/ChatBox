const User = require('../model/user');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async(req, res) => {
  try {
    const {username, password} = req.body;
    const val = await User.findOne({username});
    if(!val) return res.status(401).json({error: 'User not found'});

    const val2 = await val.comparePassword(password);
    if(!val2) return res.status(401).json({error: 'Invalid credentials'});

    const token = jwt.sign({ id: val._id, username: val.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({token});
  }
  catch(err) {
    console.error('Login error:', err);
    res.status(500).json({error: 'Internal server error'});
  }
};