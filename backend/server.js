const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const path = require('path');

const devicesRoutes = require('./routes/devices.routes');

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.io = io;
  next();
});

/* API ENDPOINTS */
app.use('/api/v1', devicesRoutes);

/* API ERROR PAGES */
app.use('/api', (req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

/* REACT WEBSITE */
app.use(express.static(path.join(__dirname, '../build')));
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/* START SERVER */
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log('Server is running on port: '+port);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  
  socket.on('refresh', () => {
    socket.broadcast.emit('refresh');
  });

});

module.exports = server;
