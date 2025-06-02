const Student = require("../models/student.model");
const Attendance =  require('../models/attendance.model');
exports.studentProfile = async (req, res) => {
  const user = req.user;
  try {
    const profile = await Student.findOne({ student_id: user.id })
      .populate("student_id", "name email")
      .populate("class_id", "class_name");
    if (!profile)
      return re.status(400).json({ Message: "Profile details not found" });

    return res
      .status(200)
      .json({ Message: "Profile fetched successfully", Profile: profile });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAttendance = async (req, res) => {
  const userId = req.user.id;
  try {
    const student = await Student.findOne({ student_id: userId }).populate("class_id", "class_name");
    if (!student) {
      return res.status(404).json({ Message: "Student not found" });
    }

    const attendanceRecords = await Attendance.find({ 
      studentId: student.id, 
      classId: student.class_id
    });

    if (!attendanceRecords) {
      return res.status(404).json({ Message: "No attendance records found" });
    }

    // Calculate attendance summary
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === "present").length;
    const absentDays = totalDays - presentDays;

    // Return attendance summary along with records
    return res.status(200).json({
      Message: "Attendance fetched successfully",
      Class: student.class_id,
      TotalDays: totalDays,
      PresentDays: presentDays,
      AbsentDays: absentDays,
      AttendanceRecords: attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};