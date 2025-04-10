const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    date_of_birth:{
        type:Date,
        required:true
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:true,
    },
    date_of_joining:{
        type:Date,
        default:Date.now(),
        required:true
    },
    years_of_experience:{
        type:Number,
        required:true
    },
    phone_number:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    is_class_teacher:{
        type:Boolean,
        required:true,
        default:false
    },
    classes_assigned:{    //reVisit this and change to objectId
        type:String,
        required:true
    },
    qualifications:{
        type:[String],
        required:true
    },
    subject_specialization:{
        type:String,
        required:true
    }

}, {timestamps:true});


module.exports = mongoose.model("teacher", teacherSchema)