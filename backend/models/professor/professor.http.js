//http require for users and autentication
const express = require('express');
const professorLogic = require('./Professor.logic');
const tokenLogic = require('../token/tokens_logic')
const professors = express.Router();

//GET all profeessors
professors.get("/professors/all", (req, res, next) => {
  const professors = professorLogic.getAllProfessors();
  professors.then(data => {
    var message;
    if (data.length !== 0)
      message = 'professors fetched successfully!';
    else {
      message = 'empty database.';
    }
    res.status(200).json({
      message: message,
      professors: data
    });
  }).catch(error => {
    var err = new Error(error);
    err.status = 400;
    return next(err);
  });

});

// adding to waiting list
professors.put("/professors/add_waiting_list", tokenLogic.verifyToken, (req, res, next) => {
  if (req.body.id) {
    professorLogic.addWaitingList(req.body.id, req.body.user._id, false).then(professor => {
      return res.status(200).json({
        message: 'sccess!',
        wait: professor
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

// delete from waiting list 
professors.put("/professors/delete_waiting_list", tokenLogic.verifyToken, (req, res, next) => {
  if (req.body.id) {
    professorLogic.deleteWaitingList(req.body.id, req.body.user._id).then(professor => {
      return res.status(200).json({
        message: 'sccess!',
        Professor: professor
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

// after finish with Patient
professors.put("/professors/availability", tokenLogic.verifyToken, tokenLogic.doctorTag, (req, res, next) => {
  if (req.body.patientId) {
    professorLogic.cheackAvailability(req.body.user._id, req.body.patientId).then(professor => {
      return res.status(200).json({
        message: 'sccess!',
        waitingList: professor.waitingList
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

module.exports = professors;
