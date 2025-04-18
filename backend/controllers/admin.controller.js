const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Subject = require("../models/subject.model");
const Class = require("../models/class.model");
const MappingSchema = require("../models/subject-teacher-mapping.model");
const teacherModel = require("../models/teacher.model");

exports.adminSignup = async (req, res) => {
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin)
    return res.status(400).json("Admin already exists, please log in");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ Error: "All Fields are mandatory" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ Message: "Password must be longer than 6 characters" });
    if (!validator.isEmail(email))
      return res.status(400).json({ Message: "Wrong Email Format!!" });
    const hashedpassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name: name,
      email: email,
      password: hashedpassword,
      role: "admin",
    });

    await newAdmin.save();

    return res.status(200).json("Admin created successfully :D");
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(400).json("User does not exist, please sign up");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) return res.status(400).json("Invalid credentials");
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json("Login successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};

exports.mappingTeacherSubjectClass = async (req, res) => {
  const { ...data } = req.body;
  const user = req.user;
  try {
    if (user.role != "admin")
      return res
        .status(401)
        .json({ Message: "Not Authorized to perform action!" });
    if (!data.teacherName || !data.subjectName || !data.className)
      return res.status(400).json({ Message: "All Fields are required!" });
    const teacher = await User.findOne({
      name: data.teacherName,
      role: "teacher",
    });
    const classs = await Class.findOne({ class_name: data.className });
    const subject = await Subject.findOne({ subjectName: data.subjectName });

    const newMapping = new MappingSchema({
      teacherId: teacher.id,
      classId: classs.id,
      subjectId: subject.id,
    });

    await newMapping.save();
    return res
      .status(400)
      .json({ Message: "Alloted the class and subject to the teacher" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Intertnal Server Error!" });
  }
};

exports.classes = async (req, res) => {
  const user = req.user;
  const { class_name, teacher } = req.body;
  try {
    if (user.role != "admin")
      return res.status(401).json({ Message: "Not Authorized to perform action" });
    
    if(!class_name || !teacher) return res.status(400).json({Message: "Please Fill All the Details"});

    const teacher_details = await User.findOne({name: teacher , role: 'teacher'});
    if(!teacher_details) return res.status(400).json({Message: "Not Authorized!!"})



    const existingTeacher = await Class.findOne({class_teacher_id: teacher_details.id});
    if(existingTeacher) return res.status(400).json({Message:"Teacher Already Assigned Class."})
    const newClass = new Class({
      class_teacher_id: teacher_details.id,
      class_name: class_name,
      total_students: 0,
    });
    const Teacher = await teacherModel.findOne({teacherId: teacher_details.id})
    Teacher.is_class_teacher = true;
    await Teacher.save();
    await newClass.save();

    return res.status(200).json("class added");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};