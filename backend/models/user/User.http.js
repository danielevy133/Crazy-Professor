//http require for users and autentication
const express = require('express');
const userLogic = require('./User.logic');
const professorLogic = require('../professor/Professor.logic');
const tokenLogic = require('../token/tokens_logic')
const users = express.Router();

//GET all users
users.get("/users/all", tokenLogic.verifyToken, tokenLogic.rolesAdmin, (req, res, next) => {
  const users = userLogic.getAllUsers();
  users.then(data => {
    var message;
    if (data.length !== 0)
      message = 'Users fetched successfully!';
    else {
      message = 'empty database.';
    }
    res.status(200).json({
      message: message,
      users: data
    });
  }).catch(error => {
    var err = new Error(error);
    err.status = 400;
    return next(err);
  });

});

//Create new user
users.post("/users/create", (req, res, next) => {
  if (req.body.firstName &&
    req.body.username &&
    req.body.lastName &&
    req.body.password &&
    req.body.passwordConf &&
    req.body.tag) {
    const user = {
      firstName: req.body.firstName,
      username: req.body.username,
      lastName: req.body.lastName,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      tag: req.body.tag
    };
    const created = userLogic.create(user);
    created.then(theUser => {
      const token = tokenLogic.createToken(theUser);
      if (theUser.tag == 'doctor') {
        professorLogic.createProfessor({ userId: theUser._id });
      }
      return res.status(200).json({
        message: 'sccess!',
        token: token.token,
        tag: theUser.tag
      });
    }).catch(error => {
      var err = new Error(error);
      err.status = 400;
      return next(err);
    });
  } else {
    var err = new Error('missing params');
    err.status = 400;
    return next(err);
  }
});

// Login
users.post('/profile', function (req, res, next) {
  if (req.body.username && req.body.password) {
    const authnticated = userLogic.checkUser(req.body.username, req.body.password);
    authnticated.then(authUser => {
      const token = tokenLogic.createToken(authUser);
      return res.status(200).json({
        message: 'token created',
        token: token.token,
        tag: authUser.tag
      });
    }).catch(error => {
      if (error == 'username dosent exist' || error == 'wrong password')
        return res.status(200).json({
          message: 'Wrong Credentials'
        });
      else {
        var err = new Error(error);
        err.status = 400;
        return next(err);
      }
    });
  } else {
    var err = new Error('missing user or password');
    err.status = 400;
    return next(err);
  }
});

//Update personal information by user or admin
users.put("/users/edit_user", tokenLogic.verifyToken, (req, res, next) => {
  if (req.body.firstName &&
    req.body.username &&
    req.body.lastName &&
    req.body.password &&
    req.body.passwordConf &&
    req.body.tag &&
    req.body.oldUserName) {
    const user = {
      firstName: req.body.firstName,
      username: req.body.username,
      lastName: req.body.lastName,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      tag: req.body.tag
    };
    const edited = userLogic.editUser(req.body.user, user, req.body.oldUserName);
    edited.then(result => {
      return res.status(200).json({
        message: 'Updated',
        token: tokenLogic.createToken(result).token
      });
    }).catch(error => {
      var err = new Error(error);
      err.status = 400;
      return next(err);
    });
  } else {
    var err = new Error('missied parameters');
    err.status = 400;
    return next(err);
  }
});

// update Roles for admin
users.get("/users/edit_role", tokenLogic.verifyToken, tokenLogic.rolesAdmin, (req, res, next) => {  //, tokenLogic.rolesAdmin
  const editRole = userLogic.editUserRole(req.body.role, req.body.username);
  editRole.then(result => {
    return res.status(200).json({
      message: 'Updated User Role'
    });
  }).catch(error => {
    var err = new Error(error);
    err.status = 400;
    return next(err);
  });
});

users.get("/users/delete", (req, res, next) => {  //, tokenLogic.rolesAdmin
  const editRole = userLogic.deleteUser(req.body.id);
  editRole.then(result => {
    return res.status(200).json({
      message: 'delete user'
    });
  }).catch(error => {
    var err = new Error(error);
    err.status = 400;
    return next(err);
  }); 
});

users.get("/users/checkRole", tokenLogic.verifyToken, (req, res, next) => {
  res.status(200).json({ message: req.body.user.role, tag: req.body.user.tag});
});

module.exports = users;
