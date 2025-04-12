const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    class_teacher_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teacher',
        required:true,
    },
    class_name:{
        type:String,
        required:true,
    },
    total_students:{
        type:Number,
        required:true,
    }
});

module.exports = mongoose.model('class', classSchema);