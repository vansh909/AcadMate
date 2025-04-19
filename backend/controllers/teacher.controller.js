const Classes = require('../models/class.model');
const Students = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const mappings = require('../models/subject-teacher-mapping.model');


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


exports.getTeacherProfile = async(req, res)=>{
    const user = req.user;
    try {
        if(user.role !='teacher') return res.status(400).json({Message:"Not Authorized!"});
        const teacherDetails = await Teacher.findOne({teacherId: user._id}).populate('teacherId', 'name email');
        if(!teacherDetails) return res.status(400).json({Message:"No Teacher Found!"});
        return res.status(200).json({Message:"Teacher Profile Fetched Successfully!", teacher:teacherDetails});
    } catch (error) {
        console.log(error); 
        return res.status(500).json({Error:"Internal Server Error!"});
    }
}
exports.getClassLists = async (req, res) => {
    try {
        const user = req.user;

        if (user.role !== 'teacher') {
            return res.status(400).json({ Message: "Not Authorized!" });
        }

        const classes = await mappings.find({ teacherId: user._id })
        .populate('classId', 'class_name total_students')
        .populate('subjectId', 'subjectName');;

        if (!classes || classes.length === 0) {
            return res.status(404).json({ Message: "No classes assigned to you." });
        }

        return res.status(200).json({ Message: "Classes fetched successfully!", classes });
    } catch (error) {
        console.error("Error fetching class lists:", error);
        return res.status(500).json({ Error: "Internal Server Error!" });
    }
};
