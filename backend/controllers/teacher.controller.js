const userModel = require("../models/user.model");

exports.getStudentList = async (req,res)=>{
    try{
    const user = req.user;
    if(user.role !== 'teacher') return res.status(401).json("Only teachers can access");

    const mappings = await MappingSchema.find({teacherId: user._id});

    if(!mappings.length) return res.status(404).json("no mapping found");

    const classIds = mappings.map((t)=> t.classId);
    const classes = await Class.find({ _id: classIds}).populate("students");

    res.status(200).json({ classes });
    } catch (error) {
    console.log("Error in getStudentList:", error);
    res.status(500).json({ error: "Internal Server Error" });
    }   
}
