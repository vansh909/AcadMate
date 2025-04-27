const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assignmentName:{
        type:String,
        required:true
    },
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
    endDate:{
        type:Date,
        required:true
    }

}, {timestamps:true});


module.exports = mongoose.model("assignment", assignmentSchema)