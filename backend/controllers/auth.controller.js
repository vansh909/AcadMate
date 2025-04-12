const jwt = require('jsonwebtoken');
const user = require('../models/user.model')
const cookies = require('cookie-parser')

exports.refreshToken = async (req,res)=>{
    const refreshToken = req.cookies["refreshtoken"];
    if(!refreshToken) return res.status(400).json("Token invalid or expired");

    //verify
    jwt.verify(refreshToken, process.env.refreshkey, async (err,result)=>{
        if(err) return res.status(400).json(err);

        const User = await user.findById(result.id);
        if(!User) return res.status(400).json("User doesn't exist");

        const newAccessToken = jwt.sign({id:User.id}, process.env.JWT_SECRET, {expiresIn:'15m'});
        console.log(newAccessToken);

        res.cookie("refreshtoken", newAccessToken, {
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge : 15*60*1000
        })

        return res.status(200).json("Token refreshed successfully!");

    })
}