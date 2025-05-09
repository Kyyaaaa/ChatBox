const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
const connectDB = require('./model/database');
const messageRoutes = require('./controller/messageRoutes');

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

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.render('home');
});