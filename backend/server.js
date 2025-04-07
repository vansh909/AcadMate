const port  = process.env.PORT || 4000;
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();


const User = require('./models/user.model');
const fake = require('./models/fakeMode');
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

