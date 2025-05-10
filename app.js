const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
const connectDB = require('./model/database');
const messageRoutes = require('./controller/messageRoutes');
const Message = require('./model/message'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

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

app.get('/home', (req, res) => {
  res.render('home');
});


// WebSocket logic
io.on('connection', socket => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    const val = new Message({content: msg});
    await val.save();
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

