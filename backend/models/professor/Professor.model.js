//user schema for documents
const mongoose = require('mongoose');

const ProfessorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
    required: true,
    trim: true
  },
  waitingList: [{
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    dateCome: {
      type: Date,
      required: true,
      defult: Date.now()
    },
    getMassage: {
      type: Boolean,
      required: true,
      defult: false
    }
  }],
  availability: {
    type: Boolean,
    required: true,
    default: true
  }
});

var Professor = mongoose.model('Professor', ProfessorSchema);
module.exports = Professor;
