require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
const connectDB = require('./model/database');
const messageRoutes = require('./controller/messageRoutes');
const userRoutes = require('./controller/userRoutes');
const Message = require('./model/message'); 
const User = require('./model/user');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// EJS config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Static file 
app.use(express.static(path.join(__dirname, 'public')));

// JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

// API
app.use('/api', messageRoutes);
app.use('/api', userRoutes);

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// WebSocket logic
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Debug
  console.log(token);
  if(!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if(err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
});

io.on('connection', socket => {
  console.log('A user connected', socket.user.username);

  socket.on('chat message', async (msg) => {
    const val = new Message({content: msg});
    await val.save();
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Debug
connectDB().then(async() => {
  try {
    const flag = await User.findOne({username: 'testuser2'});
    if(!flag) {
      const val = new User({
        username: 'testuser2',
        password: '123'
      });
      await val.save();
      console.log('User saved!');
    }
    const val = await User.findOne({username: 'testuser'});
    const val2 = await val.comparePassword('123');
    if(val2) console.log('Password correct!');
    else console.log('Passowrd is not correct');
    console.log('SECRET_KEY:', process.env.SECRET_KEY);
  }
  catch(err) {
    console.error("Error creating user!", err);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

