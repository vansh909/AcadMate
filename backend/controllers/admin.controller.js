const User  = require('../models/user.model');
const bcrypt = require('bcryptjs');
const validator = require('validator')
const jwt = require('jsonwebtoken')
exports.adminSignup = async (req,res)=>{
    const existingAdmin = await User.findOne({role: "admin"});
    if(existingAdmin) return res.status(400).json("Admin already exists, please log in");
    try{
        const {name,email,password} = req.body;
        if(!name || !email || !password) return res.status(400).json({Error:"All Fields are mandatory"});

        if(password.length < 6) return res.status(400).json({Message:"Password must be longer than 6 characters"});
        if(!validator.isEmail(email)) return res.status(400).json({Message:"Wrong Email Format!!"});
        const hashedpassword = await bcrypt.hash(password,10);

        const newAdmin = new User({
            name:name,
            email:email,
            password:hashedpassword,
            role: "admin"
        })

        await newAdmin.save()
        
       return res.status(200).json("Admin created successfully :D")
    }catch(err){
        console.error(err);
        return res.status(400).json(err);
    }

}



exports.adminLogin = async(req, res)=>{
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
