const jwt = require('jsonwebtoken');

const User = require('../models/user.model');


exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies['token'];
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const authUser= await User.findById(decoded._id);
        req.user = authUser
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
