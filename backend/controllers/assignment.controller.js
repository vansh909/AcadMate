const Assignment = require('../models/assignment.model');
const Class = require('../models/class.model');
const cloudinary = require('../config/cloudinary');
const multer = require('../middlewares/multer');

//multer + cloudinary
exports.addAssignment = async (req, res) => {
    console.log("controller hit!");
    try {
        const {class_name,dateEnd} = req.body;
        const result = await cloudinary.uploader.upload(req.file.path); 
        console.log(result);

        const classId = await Class.findOne({ class_name });

        if (!classId) {
            return res.status(404).json({
                success: false,
                message: `Class with name ${class_name} not found`
            });
        }

        const newAssignment = new Assignment({
            teacherId: req.user.id,
            classAssigned:classId.id,
            fileUrl:result.secure_url,
            dateEnd:dateEnd,
        });

        await newAssignment.save();

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: newAssignment, 
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
