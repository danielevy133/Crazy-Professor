//user logic for require and response to MongoDB
const User = require('./User.model');
const bcrypt = require('bcrypt');
//var NodeGeocoder = require('node-geocoder'); // Google geocoder sevice

class userLogic {

  static getAllUsers() {
    const promise = User.find().then(users => {
      return users;
    });
    return promise;
  }

  static create(userJson) {
    if (userJson.password !== userJson.passwordConf)
      return Promise.reject('Passwords do not match.');

    const user = new User({
      firstName: userJson.firstName,
      username: userJson.username,
      lastName: userJson.lastName,
      password: userJson.password,
      passwordConf: userJson.passwordConf,
      tag: userJson.tag
    });
    const promise = user.save().then(createUser => {
      return createUser;
    });
    return promise;
  }

  static getUser(username) {
    const promise = User.findOne({ username: username }).then(theUser => {
      if (theUser === null)
        return Promise.reject('username dosent exist');
      return theUser;
    });
    return promise;
  }

  static getUserById(userId) {
    const promise = User.findById(userId).then(theUser => {
      if (theUser === null)
        return Promise.reject('user dosent exist');
      return theUser;
    });
    return promise;
  }

  static checkUser(username, pass) {
    const promise = this.getUser(username).then(user => {
      return bcrypt.compare(pass, user.password).then(result => {
        if (result === true)
          return user;
        else
          return Promise.reject('wrong password');
      });
    });
    return promise;
  }

  static editUser(editor, userToEdit, usernameToEdit) {
    const promise = this.getUser(usernameToEdit).then(user => {
      if (editor.username === usernameToEdit || editor.role === 'Admin') {
        return User.findByIdAndUpdate(user._id, userToEdit, { new: true }).then(result => {
          return result;
        });
      } else {
        return Promise.reject('Unauthorized!');
      }
    });
    return promise;
  }

  static editUserRole(newRole, usernameToEdit) {
    const promise = this.getUser(usernameToEdit).then(user => {
      return User.findByIdAndUpdate(user.id, { role: newRole }, { new: true }).then(result => {
        return result;
      });
    });

    return promise;
  }

  static deleteUser(id) {
    const promise = User.deleteOne({ _id: id }).then(result => {
      return result.deletedCount;
    });
    return promise;
  }
}
module.exports = userLogic;
