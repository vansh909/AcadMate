const port  = process.env.PORT || 4000;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // allows cookies to be sent
}));



const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const refreshTokenRoutes  = require('./routes/auth.routes');
const teacherRoutes = require('./routes/teacher.routes');
const assignRoutes = require('./routes/assignment.routes');
const studentRoutes = require('./routes/student.routes');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use("/", refreshTokenRoutes)
app.use("/teacher", teacherRoutes)
app.use('/public', express.static('public'));
app.use('/assignment', assignRoutes);
app.use('/student', studentRoutes);
const agenda =require('./jobs.js');

app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
})


mongoose.connect(process.env.MONGO_URI)
.then(async() => {
    console.log('Connected to MongoDB');
    await agenda.start();
    console.log("agenda started");
}
).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
})

