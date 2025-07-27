// const teacherModel = require('../models/teacher.model');
// const subjectModel = require('../models/subject.model');
// const classModel = require('../models/class.model');
// const mappingModel = require('../models/subject-teacher-mapping.model');
// const timetableModel = require('../models/timetable.model'); // assuming it's classSchedule
// const { spawn } = require('child_process');

// exports.generateTimetable = async (req, res) => {
//   try {
//     // 🔄 Clean old timetable data
//     await timetableModel.deleteMany({});

//     // 📥 Get all required data
//     const classes = await classModel.find();
//     const subjects = await subjectModel.find();
//     const mappings = (await mappingModel.find()).map(m => ({
//       ...m.toObject(),
//       classId: m.classId.toString(),
//       subjectId: m.subjectId.toString(),
//       teacherId: m.teacherId.toString()
//     }));

//     // 👨‍🏫 Populate teacherId (User.name)
//     const teachers = await teacherModel.find().populate({
//       path: 'teacherId',
//       select: 'name'
//     });

//     teachers.forEach(t => {
//       if (!t.teacherId || !t.teacherId.name) {
//         console.warn(`Teacher ${t._id} missing valid user or name`);
//       }
//       console.log(`Teacher ${t._id} - Name: ${t.teacherId?.name || 'Unknown'}`);
//     });

//     // 🔧 Process for Python
//     const processedTeachers = teachers.map(t => ({
//       _id: t._id.toString(), // mapping uses this
//       name: t.teacherId?.name || 'Unknown'
//     }));

//     const payload = {
//       classes,
//       subjects,
//       teachers: processedTeachers,
//       mappings
//     };

//     // 🐍 Run Python script
//     const py = spawn('python3', ['ai-timetable/timetable_solver.py']);
//     let result = '';
//     let error = '';

//     py.stdout.on('data', (data) => (result += data.toString()));
//     py.stderr.on('data', (data) => (error += data.toString()));
//     py.stdin.write(JSON.stringify(payload));
//     py.stdin.end();

//     py.on('close', async (code) => {
//       if (code === 0) {
//         const timetableData = JSON.parse(result);

//         // 🔁 Convert teacherId to name
//         const fullTimetable = await Promise.all(
//           timetableData.map(async (item) => {
//             const teacher = await teacherModel.findById(item.teacherId).populate({
//               path: 'teacherId',
//               select: 'name'
//             });

//             return {
//               class: item.class,
//               day: item.day,
//               period: item.period,
//               subject: item.subject,
//               teacher: teacher?.teacherId?.name || 'Unknown'
//             };
//           })
//         );

//         // ✅ Save to MongoDB
//         await timetableModel.insertMany(fullTimetable);

//         return res.status(200).json({ timetable: fullTimetable });
//       } else {
//         return res.status(500).json({ error });
//       }
//     });

//   } catch (err) {
//     console.error('Timetable generation error:', err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };



const teacherModel = require('../models/teacher.model');
const subjectModel = require('../models/subject.model');
const classModel = require('../models/class.model');
const mappingModel = require('../models/subject-teacher-mapping.model');
const timetableModel = require('../models/timetable.model');
const { spawn } = require('child_process');

exports.generateTimetable = async (req, res) => {
  try {
    // 🧹 Clean old timetable
    await timetableModel.deleteMany({});

    // 📥 Load required data
    const classes = await classModel.find();
    const subjects = await subjectModel.find();
    const mappings = (await mappingModel.find()).map(m => ({
      ...m.toObject(),
      classId: m.classId.toString(),
      subjectId: m.subjectId.toString(),
      teacherId: m.teacherId.toString()
    }));

    const teachers = await teacherModel.find().populate({
      path: 'teacherId',
      select: 'name'
    });

    // 🧠 Pre-process teacher data for Python
    const processedTeachers = teachers.map(t => ({
      _id: t._id.toString(),
      name: t.teacherId?.name || 'Unknown'
    }));

    const payload = {
      classes,
      subjects,
      teachers: processedTeachers,
      mappings
    };

    // 🐍 Run Python script
    const py = spawn('python3', ['ai-timetable/timetable_solver.py']);
    let result = '';
    let error = '';

    py.stdout.on('data', (data) => result += data.toString());
    py.stderr.on('data', (data) => error += data.toString());
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();

    py.on('close', async (code) => {
      if (code === 0) {
        const timetableData = JSON.parse(result);

        // ✅ Store teacherId directly in DB
        const fullTimetable = timetableData.map(item => ({
          class: item.class,
          day: item.day,
          period: item.period,
          subject: item.subject,
          teacher: item.teacherId // storing as ObjectId string
        }));

        await timetableModel.insertMany(fullTimetable);
        return res.status(200).json({ timetable: fullTimetable });
      } else {
        console.error("Python error:", error);
        return res.status(500).json({ error });
      }
    });

  } catch (err) {
    console.error('Timetable generation error:', err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

