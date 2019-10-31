const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const redisClient = require('./db/db');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();
app.use(logger('short'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', (req, res) => {
  res.send('2222');
})

app.all('*', async (req, res, next ) => {
  const paths = ['/user/login'];
  if(paths.includes(req.path)) return next();
  const resJson = {
    code: 10000,
    data: null,
    msg: 'no login'
  };
  const token = req.headers.token;
  if(!token) {
    return res.json(resJson)
  }
  const sskey = await redisClient.getAsync(token);
  if(!sskey) {
    return res.json(resJson)
  }
  next();
})

app.use('/', indexRouter);
app.use('/user', userRouter);

// error handler
app.use((err, req, res, next)=>{
  console.error(err.stack)
  res.status(500).send(err.message)
})

module.exports = app;
