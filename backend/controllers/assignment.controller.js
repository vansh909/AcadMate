const Assignment = require('../models/assignment.model');
const Class = require('../models/class.model');
const cloudinary = require('../config/cloudinary');
const multer = require('../middlewares/multer');

//multer + cloudinary
exports.addAssignment = async (req, res) => {
    console.log("controller hit!");
    try {
        const {assignmentName, class_name,endDate} = req.body;
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
            assignmentName: assignmentName,
            teacherId: req.user.id,
            classAssigned:classId.id,
            fileUrl:result.secure_url,
            endDate:endDate,
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

exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate('teacherId', 'name') // Populate teacher's name
            .populate('classAssigned', 'class_name'); // Populate class name

        if (!assignments || assignments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No assignments found',
            });
        }

        // Map assignmentName to name for frontend compatibility
        const formattedAssignments = assignments.map((assignment) => ({
            _id: assignment._id,
            name: assignment.assignmentName, // Map assignmentName to name
            endDate: assignment.endDate,
            classAssigned: assignment.classAssigned,
            fileUrl: assignment.fileUrl,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
        }));

        res.status(200).json({
            success: true,
            message: 'Assignments retrieved successfully',
            assignments: formattedAssignments,
        });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};