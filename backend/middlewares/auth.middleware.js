const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies['token']; // Ensure the token is being read correctly
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const authUser = await User.findById(decoded.id); // Fetch the user from the database

        if (!authUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = authUser; // Attach the user to the request object
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({ Error: 'Internal Server Error' });
    }
};
