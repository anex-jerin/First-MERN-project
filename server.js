require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
//function to create events in logs folder(filename reqLog) 
const { logger } = require('./middleware/logger');
// handles error and create error file in logs folder(filename errLog)
const errorHandler = require('./middleware/errorHandler');

const cookieParser = require('cookie-parser')
// which origins can access the API
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
// connection to mongoDB
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')
const {logEvents}  = require('./middleware/logger')
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)
connectDB()
app.use(logger);
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())

app.use(express.static('public'));
//home route
app.use('/', require('./routes/root'));
//users route
app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.send({ message: 'not available' });
  } else { 
    res.type('txt').send('404 Not Found');
  }
}); 

//error handler middleware
app.use(errorHandler);

mongoose.connection.once('open',()=>{
  console.log('connected to mongoDB')
  app.listen(PORT, () => console.log(`listening to PORT :${PORT}`))
})

mongoose.connection.on('error', err=>{
  console.log(err)
  logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})