const port  = process.env.PORT || 4000;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();


const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)






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

