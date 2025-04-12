const Subject = require('../models/subject.model');


exports.addSubject = async(req, res)=>{
    const {subjectName} = req.body;
    // console.log(subjectName)
    const user = req.user;
    try {
        if(user.role != 'admin') return res.status(401).json({Message: "Not Authorized to perform action!"});

        const existingSubject = await Subject.findOne({subjectName: subjectName});

        if(existingSubject) return res.status(400).json({Message: "Subject already Exists!"});
        const newSubject = new Subject({
            subjectName: subjectName
        });

        await newSubject.save();
        return res.status(201).json({Message: "Subject added Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({Error:"Internal Server Error"});
    }
}