const mongoose = require('mongoose')

const mappingSchema = new mongoose.Schema({
    classId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "class",
        required:true
    },
    teacherId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "teacher",
        required:true
    },
    subjectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"subject",
        required: true
    }
});

module.exports = mongoose.model('student-teacher-class-relation', mappingSchema);