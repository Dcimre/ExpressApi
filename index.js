const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const AppError = require('./AppError');
const globalErrorHandler = require('./globalErrorHandler');

const whitelist = ['http://localhost:3020'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// IMPORT ROUTES

const authRoute = require('./routes/auth');
const eventRoute = require('./routes/events');
const friendRoute = require('./routes/friends');
const groupRoute = require('./routes/groups');

dotenv.config();

//connect to DB

mongoose.connect(

  process.env.DB_CONNECT,
  { useNewUrlParser: true },
  { ssl: true },
  ()=> console.log('we are connected to the DB !')
);

// MIDDLEWARES

app.use(express.json());

// ROUTE MIDDLEWARE

app.use('/api/user', authRoute,cors(corsOptions));
app.use('/api/friends', friendRoute,cors(corsOptions));
app.use('/api/events', eventRoute,cors(corsOptions));
app.use('/api/groups', groupRoute,cors(corsOptions));


// HANDLING NOT EXISTING ROUTES

app.all('*', (req, res, next) =>{



  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

});

// GLOBAL ERROR HANDLER

app.use(globalErrorHandler);

// DEFINE PORT AND START SERVER

const port = 3020;

app.listen(port, ()=> console.log( `Server running on port : ${port}`));
