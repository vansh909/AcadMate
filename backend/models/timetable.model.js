// const mongoose = require('mongoose');
// const TimetableSchema = new mongoose.Schema({
//   class: String,
//   day: String,
//   period: Number,
//   subject: String,
//   teacher: String
// });
// module.exports = mongoose.model('classSchedule', TimetableSchema);



const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  class: String,
  day: String,
  period: Number,
  subject: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',  // referencing the teacher model
    required: true
  }
});

module.exports = mongoose.model('classSchedule', TimetableSchema);
