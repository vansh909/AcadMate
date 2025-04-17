const mappings = require('../models/subject-teacher-mapping.model');
const userModel = require('../models/user.model');
const studentModel = require('../models/student.model');
exports.getStudentList = async (req, res) => {
    try {
        console.log(req.user);

        if (req.user.role !== 'teacher') {
            return res.status(401).json("Only teachers are allowed.");
        }

        const mapping = await mappings.findOne({ teacherId: req.user._id });
        if (!mapping) {
            return res.status(404).json("Teacher doesn't exist, check again.");
        }

        const classId = mapping.classId;
        if (!classId) {
            return res.status(404).json("No mapping for class.");
        }

        // Find students in the class
        const students = await studentModel.find({ class_id: classId }).lean();
        if (!students || students.length == 0) {
            return res.status(200).json("No students found.");
        }

        // Find user details for the students
        const findStudent = await userModel.find({
            _id: { $in: students.map(s => s.student_id) }
        }, "name email");

        return res.status(200).json(findStudent);
    } catch (error) {
        console.error("Error in getStudentList:", error);
        return res.status(400).json(error);
    }
};