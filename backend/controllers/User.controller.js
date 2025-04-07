const user = require('../models/user.model');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.signup = async (req,res)=>{
    try{

        const {name,email,password} = req.body;
        const existingUser = await findOne({email});

        if(existingUser) return res.status(400).json("User already exists, please log in");

        const hashedpassword = bcrypt.hash(password,10);

        const newUser = new user({
            name:name,
            email:email,
            password:hashedpassword
        })

        await newUser.save();
        res.status(200).json("User created successfully :D")
    }catch(err){
        return res.status(400).json(err);
    }
}


exports.login = async(req, res)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await user.findOne({email});

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
