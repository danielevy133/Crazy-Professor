//user logic for require and response to MongoDB
const Professor = require('./Professor.model');
//const AvilabiltyLogic = require('../availability/Availability.logic');
const UserLogic = require('../user/User.logic');

class ProfessorLogic {

  static getAllProfessors() {
    const promise = Professor.find().then(professors => {
      const promises = [];
      professors.forEach(professor => {
        promises.push(this.getUser(professor.userId).then(user => {
          const newProfessor = {
            _id: professor._id,
            waitingList: professor.waitingList,
            user: user,
            availability: professor.availability
          };
          return newProfessor;
        }));
      });
      return Promise.all(promises).then(professors => { return professors; });
    }).then(professors => {
      const promises = [];
      professors.forEach(professor => {
        if (professor.waitingList.length == 0)
          promises.push(Promise.resolve(professor));
        else {
          promises.push(this.getWaitingList(professor.waitingList).then(newWaitingList => {
            const newProfessor = {
              _id: professor._id,
              waitingList: newWaitingList,
              user: professor.user,
              availability: professor.availability
            }
            return newProfessor
          }));
        }
      });
      return Promise.all(promises);
    });
    return promise;
  }

  static getUser(userId) {
    return UserLogic.getUserById(userId).then(user => {
      const newUser = {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
      return newUser;
    });
  }

  static getWaitingList(waitingList) {
    const promises = []
    waitingList.forEach(wait => {
      promises.push(this.getUser(wait.patientId).then(user => {
        user._id = wait.patientId
        return {
          patient: user,
          dateCome: wait.dateCome,
          getMassage: wait.getMassage
        };
      }));
    });
    return Promise.all(promises);
  }

  static createProfessor(professorJson) {
    const professor = new Professor({
      userId: professorJson.userId
    });
    const promise = professor.save().then(createProfessor => {
      return createProfessor;
    });
    return promise;
  }

  static getProfessor(professorId) {
    const promise = Professor.findOne({ _id: professorId }).then(theProfessor => {
      if (theProfessor === null)
        return Promise.reject('professor dosent exist');
      return theProfessor;
    });
    return promise;
  }

  static getProfessorByUserID(userId) {
    const promise = Professor.findOne({ userId: userId }).then(theProfessor => {
      if (theProfessor === null)
        return Promise.reject('professor dosent exist');
      return theProfessor;
    });
    return promise;
  }

  static editProfessor(userId,newProfessor) {
    const promise = this.getProfessorByUserID(userId).then(professor => {
      return Professor.findByIdAndUpdate(professor._id, newProfessor, { new: true }).then(result => {
        return this.getWaitingList(result.waitingList).then(waitingList => {
          const newProfessor = {
            _id: result._id,
            waitingList: waitingList,
            userId: result.userId,
            availability: result.availability
          };
          return newProfessor;
        });
      });
    });
    return promise;
  }

  static addWaitingList(professorId, userId,getMassage) {
    const promise = UserLogic.getUserById(userId).then(user => {
      if (user.tag == 'patient') {
        return this.getProfessor(professorId).then(professor => {
          let newWait = { patientId: userId, dateCome: new Date(Date.now()) }
          if (professor.waitingList.length == 0)
            newWait.getMassage = true;
          else
            newWait.getMassage= false;
          professor.waitingList.push(newWait);
          professor.availability = false;
          return this.editProfessor(professor.userId, professor).then(professor => {
            return this.getUser(newWait.patientId).then(user => {
              return { patient: user, dateCome: newWait.dateCome, getMassage: newWait.getMassage };
            });
          });
        });
      } else {
        return Promise.reject('not patient');
      }
    });
    return promise;
  }

  static deleteWaitingList(professorId, userId) {
    const promise = this.getProfessor(professorId).then(professor => {
      if (professor.waitingList.length > 0) {
        let index = -1;
        for (let i = 0; i < professor.waitingList.length; i++)
          if (professor.waitingList[i].patientId == userId)
            index = i;
        if (index != -1)
          professor.waitingList.splice(index, 1);
        if (professor.waitingList.length == 0)
          professor.availability = true;
        else
          professor.waitingList[0].getMassage = true;
        return this.editProfessor(professor.userId, professor);
      } else {
        return Promise.reject('waitingList is empty');
      }
    }).then(professor => {
      return this.getUser(professor.userId).then(user => {
        const newProfessor = {
          _id: professor._id,
          waitingList: professor.waitingList,
          user: user,
          availability: professor.availability
        };
        return newProfessor;
      });
    });
    return promise;
  }

  static unAvailability(patientId,professorId) {
    const promise = this.addWaitingList(professorId, patientId);
    return promise;
  }

  static cheackAvailability(userId,patientId) {
    return this.getProfessorByUserID(userId).then(professor => {
        return this.deleteWaitingList(professor._id, patientId);
    });
  }

  static availability(id) {
    const promise = this.getProfessor(id).then(professor => {
        professor.availability = true;
        return this.editProfessor(professor.userId, professor);
    });
    return promise;
  }

  static deleteProfessor(id) {
    const promise = Professor.deleteOne({ _id: id }).then(result => {
      return result.deletedCount;
    });
    return promise;
  }

}
module.exports = ProfessorLogic;
