const Agenda = require('agenda');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Assignment = require('./models/assignment.model');
const Class = require('./models/class.model');
const Student = require('./models/student.model');
const User = require('./models/user.model');

const agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: 'agendaJobs' }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaitleyvriti@gmail.com",
    pass: "ojayoenzwgvxonpp",
  },
});

agenda.define('assignment due alert', async (job) => {
    console.log("agenda hit ");
    const { assignmentId } = job.attrs.data;
    const assignment = await Assignment.findById(assignmentId).populate('classAssigned');
    if (!assignment) return;

    const students = await Student.find({ class_id: assignment.classAssigned._id });
    for (const student of students) {

        const user = await User.findById(student.student_id);
        if (!user) continue;

        const mailOptions = {
            from: "jaitleyvriti@gmail.com",
            to: user.email,
            subject: `Assignment due alert!`,
            text: `Hello ${user.name},

This email is sent to remind you that you have the assignment: ${assignment.assignmentName} due in exactly 5 days. Please ensure timely submissions for the same.
Or else, 3 marks each day will be deducted for late submissions.

Regards.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending mail:', err);
            } else {
                console.log('Mail sent:', info.response);
            }
        });
    }
    console.log("maillll");
});

module.exports = agenda;