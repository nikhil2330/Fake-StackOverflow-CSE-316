const jwt = require('jsonwebtoken');
const User = require('../models/user');


module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token; 

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        req.user =  { userId: user._id, username: user.username, isAdmin: user.isAdmin };  
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ errorMessage: "Unauthorized: Invalid token" });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ errorMessage: "Unauthorized: Admin access required" });
    }
    next();
};