require('dotenv').config();
const { createServer } = require('http');
const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorHandler = require('./middlewares/error');
const { fileStorage, fileFilter } = require('./util/file');

const app = express();

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use(errorHandler);

mongoose.set('strictQuery', true).connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected!');
    const httpServer = createServer(app);
    const io = require('./socket').init(httpServer);
    io.on('connection', (socket) => {
      console.log(socket.id);
    });

    httpServer.listen(8080);
  })
  .catch((err) => console.log(err));