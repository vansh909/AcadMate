const MappingSchema = require("../models/subject-teacher-mapping.model");
const Class = require("../models/class.model");

exports.getStudentList = async (req,res)=>{
    console.log("hit")
    try{
    const user = req.user;
    console.log(user);
    if(user.role !== 'teacher') return res.status(401).json("Only teachers can access");

    const mappings = await MappingSchema.findOne({teacherId: user._id});

    if(mappings.length==0) return res.status(404).json("no mapping found");

    const classIds = mappings.map((t)=> t.classId);
    const classes = await Class.find({ _id: { $in: classIds } }).populate("students")

  

    res.status(200).json({ classes });
    } catch (error) {
    console.log("Error in getStudentList:", error);
    res.status(500).json({ error });
    }   
}
