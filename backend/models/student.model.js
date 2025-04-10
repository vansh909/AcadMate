const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    date_of_birth:{
        type:Date,
        required:true
    },
    father_name:{
        type:String,
        required:true
    },
    mother_name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone_number:{
        type:Number,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Student', studentSchema)