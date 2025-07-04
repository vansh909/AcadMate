const Assignment = require("../models/assignment.model");
const Class = require("../models/class.model");
const cloudinary = require("../config/cloudinary");
const multer = require("../middlewares/multer");
const uploadFileToDrive = require('../googleapi.js');

const agenda = require('../jobs.js');
const path = require('path');

const bucket = require('../firebase');
//multer + cloudinary
exports.addAssignment = async (req, res) => {

  try {
    const { assignmentName, class_name, endDate } = req.body;
    const dueDate = new Date(endDate);

    const today = new Date();
    dueDate.setHours(0, 0, 0, 0); // Set time to midnight
    today.setHours(0, 0, 0, 0); // Set time to midnight
    if (dueDate < today) {
      return res.status(400).json({
        success: false,
        message: "Due date cannot be in the past",
      });
    }
    // const result = await cloudinary.uploader.upload(req.file.path);
    // // console.log(result);
    // const filePath = req.file.path;
    // const destination = `assignments/${Date.now()}_${req.file.originalname}`;
    // const options = {
    //   destination,
    //   metadata: {
    //     contentType: req.file.mimetype,
    //   },
    // };

    // await bucket.upload(filePath, options);

    // // Get the public URL
    // const file = bucket.file(destination);
    // const [url] = await file.getSignedUrl({
    //   action: "read",
    //   expires: "03-01-2030", // You can change expiry
    // });

    const classId = await Class.findOne({ class_name });

    if (!classId) {
      return res.status(404).json({
        success: false,
        message: `Class with name ${class_name} not found`,
      });
    }

    /// googledrive 
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const folderId = '1Mh3udklaXvSbFLq7SazMdMgDE9bPokkS'; 

    const { webViewLink } = await uploadFileToDrive(filePath, fileName, folderId);
    const url = webViewLink; 




    const newAssignment = new Assignment({
      assignmentName: assignmentName,
      teacherId: req.user.id,
      classAssigned: classId.id,
      fileUrl: url,
      endDate: endDate,
      
    });

    await newAssignment.save();

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: newAssignment,
    });

    //agenda
    const milliSecondsPerDay = 24*60*60*1000;
    const alertDate = new Date(dueDate-today);
    agenda.schedule(alertDate, "assigment due alert", {assignmentId: newAssignment._id});
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("teacherId", "name") // Populate teacher's name
      .populate("classAssigned", "class_name"); // Populate class name

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No assignments found",
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
      message: "Assignments retrieved successfully",
      assignments: formattedAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
