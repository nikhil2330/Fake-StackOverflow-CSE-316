const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ errorMessage: "Unauthorized" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({ errorMessage: "Unauthorized: Invalid token" });
    }
};