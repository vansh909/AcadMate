const Classes = require('../models/class.model');
const Students = require('../models/student.model');


exports.getStudentsList = async(req, res)=>{
    const user = req.user;

    try {
        console.log(user);
        if(user.role != 'teacher') return res.status(400).json({Message:"Not Authorized!"});

        const myClass  = await Classes.findOne({class_teacher_id: user._id});
        if(!myClass) return res.status(400).json({Message:"You have not been assigned a class"});
        const studentsList = await Students.find({ class_id: myClass.id }).populate('student_id', 'name'); // only name field

        console.log(studentsList)
        if(!studentsList) return res.status(400).json({Message:`No Students in Class ${myClass.class_name}`});
        return res.status(200).json({Message:"Students fetched Successfully!", students:studentsList});
    } catch (error) {
        console.log(error);
        return res.status(500).json({Error:"Internal Server Error!"});
    }
}