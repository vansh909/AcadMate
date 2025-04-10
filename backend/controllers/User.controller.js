const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'jaitleyvriti@gmail.com',
        pass:'kepttjfvimnkjqaa'
    }
});


exports.signup = async (req,res)=>{
    try{
        
        const { ...data} = req.body;
        
        if(req.user.role != 'admin'){
            return res.status(401).json("not authorized to register students");
        }
            if(data.role !='student' && data.role !='teacher'){
                return res.status(401).json("not authorized to register students");
            }

            if(!validator.isEmail(data.email)){
                return res.status(400).json("email not valid");
            }

            const hashedpassword = await bcrypt.hash(data.password, 10);
            const newUser = new User({name: data.name,email: data.email,password: hashedpassword, role:data.role});
            await newUser.save();
            if (data.role == 'student') {
            const newStudent = new student({
                student_id:newUser._id,
                class:data.class,
                date_of_birth:data.date_of_birth,
                father_name:data.father_name,
                mother_name:data.mother_name,
                address:data.address,
                phone_number:data.phone_number
            })
            await newStudent.save();

            const mailOptions = {
                from: 'jaitleyvriti@gmail.com',
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
            The AcadMate Team`
            };
            
            transporter.sendMail(mailOptions);
            
    
            }
            return res.status(201).json({ message: `${data.role} registered successfully`, user: newUser });

    }catch(err){
        console.log(err)
        res.status(500).json(err);
    }
}


exports.login = async(req, res)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(400).json("User does not exist, please sign up");

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json("Invalid credentials");
        const token = jwt.sign({id:existingUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });


        return res.status(200).json("Login successful");
    }catch(err){
        console.error(err);
        return res.status(500).json({Error: "Internal server error"});
    }
}
