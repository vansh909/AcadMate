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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use("/", refreshTokenRoutes)
app.use("/teacher", teacherRoutes)





app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
})

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
}
).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
})

