const clas = require('../models/class.model')
exports.classes= async (req,res)=>{
    try{
    const {class_name} = req.body;
    console.log(class_name);
    const class_teacher_id = req.params.id;
    console.log(class_teacher_id);

    const newClass = new clas({
        class_teacher_id:class_teacher_id,
        class_name:class_name,
        total_students:0
    });

    await newClass.save();
    console.log(newClass);

    return res.status(200).json("class added");
    }catch(err){
        console.log(err);
        return res.status(400).json(err);

    }

}