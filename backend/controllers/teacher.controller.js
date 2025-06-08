const Classes = require('../models/class.model');
const Students = require('../models/student.model');
const Teacher = require('../models/teacher.model');
const mappings = require('../models/subject-teacher-mapping.model');
const Attendance= require('../models/attendance.model');
const circulars= require('../models/circulars.model');


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
        const teacherDetails = await Teacher.findOne({teacherId: user._id}).populate('teacherId', 'name email')
        .populate('subject_specialization', 'subjectName');

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

exports.addAttendace = async(req, res)=>{
    const user = req.user;
    const {className, date, attendance} = req.body;

    try {
        console.log(className);
        const IsClassTeacher = await Classes.findOne({class_teacher_id: user._id, class_name:className});
        // console.log(IsClassTeacher)
        if(!IsClassTeacher) return res.status(400).json({Message:"You are not the class teacher!"}); 

        // Parse and format the date properly
        const [day, month, year] = date.split('-');
        const formattedDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
        );

        // Validate if the date is valid
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({Message: "Invalid date format. Please use DD-MM-YY format"});
        }

        // Set time to start and end of day for comparison
        const startOfDay = new Date(formattedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(formattedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check for duplicate attendance entries
        for(let entry of attendance){
            const existingAttendance = await Attendance.findOne({
                classId: IsClassTeacher._id,
                studentId: entry.studentId,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });

            if (existingAttendance) {
                return res.status(400).json({
                    Message: `Attendance already marked for student ID ${entry.studentId} on ${date}`
                });
            }
        }

        // If no duplicates found, add new attendance records
        const attendanceRecords = await Promise.all(
            attendance.map(entry => {
                const newRecord = new Attendance({
                    classId: IsClassTeacher._id,
                    studentId: entry.studentId,
                    date: formattedDate,
                    status: entry.status
                });
                return newRecord.save();
            })
        );
        
        return res.status(200).json({
            Message: "Attendance added successfully!",
            records: attendanceRecords
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({Error: "Internal Server Error!"});
    }
}

exports.getCirculars = async(req,res)=>{
    try{
        const user = req.user.role;
        if(user !== 'teacher') return res.status(400).json("not allowed to access the circulars");
        const result = await circulars.find(
            {circularFor: {$in : ['teacher', 'both']}}
        )
        return res.status(200).json(result)
    }catch(err){
        return res.status(500).json(err);
    }
}