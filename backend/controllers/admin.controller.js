const User  = require('../models/user.model');
const bcrypt = require('bcrypt');
const validator = require('validator')
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

        await newAdmin.save();
        res.status(200).json("Admin created successfully :D")
    }catch(err){
        console.error(err);
        return res.status(400).json(err);
    }

}