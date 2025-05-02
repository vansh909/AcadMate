const Student = require("../models/student.model");

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
