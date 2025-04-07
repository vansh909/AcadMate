const express = require('express');
const app = express();
app.use(express.json());
const user = require('../models/user.model');
const bcrypt = require('bcrypt');

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

