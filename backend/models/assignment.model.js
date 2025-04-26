const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    classAssigned:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"class",
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    dateEnd:{
        type:Date,
        required:true
    }

}, {timestamps:true});


module.exports = mongoose.model("assignment", assignmentSchema)