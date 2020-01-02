const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
//var MongoStore = require('connect-mongo')(session);

const User = require('./models/user/User.http');
const userLogic = require('./models/user/User.logic');
const Professor = require('./models/professor/professor.http');
//const Availability = require('./models/availability/Availability.http');
const app = express();

//connect to Mongo DB
mongoose.connect("mongodb://localhost:27017/crazyProfessor", () => { })
  .then(() => {
    console.log('Connected to database!');
    userLogic.getAllUsers().then(users => {
      var bool = true;
      users.forEach(user => {
        if (user.role === 'admin')
          bool = false;
      });
      if (bool)
        return 'have not admin';
    }).then(cheak => {
      if (cheak === 'have not admin') {
        const user = {
          firstName: 'admin',
          lastName: 'admin',
          username: 'admin',
          password: '123456',
          passwordConf: '123456',
          tag: 'admin'
        };
        userLogic.create(user).then(theUser => {
          userLogic.editUserRole('Admin', theUser.username).then(userRole => {
            console.log('create first admin');
            console.log(userRole);
          })
        });
      } 
    });
  })
  .catch((error) => {
    console.log('error');
    console.log('Connection to database failed!');
  });
var db = mongoose.connection;

// fixed headers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use("/", express.static(path.join(__dirname, "superNav")));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

//My Libraries

app.use('/cp', User);
app.use('/cp', Professor);

module.exports = app;

