const jwt = require('jsonwebtoken');

const User = require('../models/user.model');


exports.isAuthenticated = async (req, res, next) => {
        const token = req.cookies['token'];
    try {
    // console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const authUser= await User.findById(decoded.id);
        req.user = authUser;
        console.log(req.user);
    
        next();
    } catch (error) {

        return res.status(500).json({ Error: 'Internal Server Error' });
    }
}
