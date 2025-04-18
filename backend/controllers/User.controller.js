const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const student = require("../models/student.model");
const Teacher = require("../models/teacher.model");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const nodemailer = require("nodemailer");
const Subject = require("../models/subject.model");
const refreshtoken = require("./auth.controller");
const Class = require("../models/class.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaitleyvriti@gmail.com",
    pass: "kepttjfvimnkjqaa",
  },
});

exports.signup = async (req, res) => {
  try {
    const { ...data } = req.body;
    console.log(req.body);

    if (req.user.role != "admin") {
      return res
        .status(401)
        .json("not authorized to register students and teachers");
    }
    if (data.role != "student" && data.role != "teacher") {
      return res.status(401).json("not authorized to register students");
    }

    if (!validator.isEmail(data.email)) {
      return res.status(400).json("email not valid");
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser)
      return res.status(400).json({ Message: "User already exists" });

    const existingUserWithSameName = await User.findOne({ name: data.name });
    if (existingUserWithSameName)
      return res
        .status(400)
        .json({
          Message: "User with the same name already exists! Try another name",
        });
    const hashedpassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: hashedpassword,
      role: data.role,
    });
    await newUser.save();
    if (data.role == "student") {
      if (
        !data.class ||
        !data.date_of_birth ||
        !data.father_name ||
        !data.mother_name ||
        !data.address ||
        !data.phone_number
      )
        return res
          .status(400)
          .json({ Message: "All Fields of students are mandatory to fill" });
      const className = await Class.findOne({ class_name: data.class });
      if (!className)
        return res.status(400).json({ Message: "Error Fetching Class" });
      const newStudent = new student({
        student_id: newUser._id,
        class: className.id,
        date_of_birth: data.date_of_birth,
        father_name: data.father_name,
        mother_name: data.mother_name,
        address: data.address,
        phone_number: data.phone_number,
      });
      await className.updateOne({$inc: {total_students: 1}});
      await newStudent.save();


      const mailOptions = {
        from: "jaitleyvriti@gmail.com",
        to: `${data.email}`,
        subject: `🎉 Welcome to AcadMate, ${data.name}!`,
        text: `Hello ${data.name},\n\nWelcome aboard! 🎓
            
            We're excited to have you join AcadMate as a valued ${data.role}. Get ready to explore, learn, and grow with us.
            
            Here are your login credentials:
            📧 Email: ${data.email}
            🔐 Password: ${data.password}
            
            Make sure to keep this information safe. If you have any questions or need assistance, feel free to reach out.
            
            Let’s make this journey amazing together! ✨
            
            Best regards,  
            The AcadMate Team`,
      };

      transporter.sendMail(mailOptions);
    } else if (data.role == "teacher") {
      const subject = await Subject.findOne({
        subjectName: data.subject_specialization,
      });
      if (!subject) {
        return res.status(400).json({ Message: "Subject Not Found!" });
      }

      if(!data.date_of_birth ||!data.gender ||!data.years_of_experience || !data.phone_number || !data.address ||!data.qualifications)
        return res.status(400).json({Message:"All Fields of Teacher Required!"})
      const newTeacher = new Teacher({
        teacherId: newUser._id,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        years_of_experience: data.years_of_experience,
        phone_number: data.phone_number,
        address: data.address,
        is_class_teacher:false,
        qualifications: data.qualifications,
        subject_specialization: subject._id,
      });

      const mailOptions = {
        from: "AcadMate.team@gmail.com",
        to: `${data.email}`,
        subject: `👩‍🏫 Welcome to AcadMate, ${data.name}!`,
        text: `Dear ${data.name},\n\nWelcome to **AcadMate**! 🎓  
          We're excited to have you on board as a valued member of our teaching faculty.
          
          Here are your login credentials:  
          📧 Email: ${data.email}  
          🔐 Password: ${data.password}
          
          Please keep this information secure and do not share it with anyone.
          
          If you have any questions or need assistance, feel free to reach out to the AcadMate support team.
          
          Let's make learning inspiring together! ✨
          
          Warm regards,  
          The AcadMate Team`,
      };

      transporter.sendMail(mailOptions);

      await newTeacher.save();
    }
    return res
      .status(201)
      .json({ message: `${data.role} registered successfully`, user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
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
      expiresIn: "15m",
    });
    const refreshtoken = jwt.sign(
      { id: existingUser.id },
      process.env.refreshkey,
      {
        expiresIn: "17d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    //refresh token for 17 days
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 17 * 24 * 60 * 60 * 1000,
    });

    console.log(existingUser.role);
    return res.status(200).json(
      {
        message:"Login successful",
        role: existingUser.role,
      });
      
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Error: "Internal server error" });
  }
};
