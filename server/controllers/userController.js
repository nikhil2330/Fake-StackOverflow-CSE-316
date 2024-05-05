const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const time = 2;

module.exports.registerUser = async (req, res) => {
    const { username, email, password, password2 } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ username: "Username already exists." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ email: "Email already registered." });
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            join_date_time: new Date()
        })
        await newUser.save();
            res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }

};



module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ email: "Email does not exist." });
        }
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ password: "Wrong email or password."})
        }
        console.log(process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
            console.error('FATAL ERROR: JWT_SECRET is not defined.');
            process.exit(1); // Exit process with failure
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        const decoded = jwt.decode(token);
        await res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: (2 * 60 * 60 * 1000) }).status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            },
            expiresAt: decoded.exp * 1000
            }).send();
        console.log("LOGGEDin");

    } catch (error) {
        console.error("Login error:", error); 
        res.status(500).json({ message: "Server error during login." });
    }
};

module.exports.logoutUser = async (req, res) => {
    console.log("logged out");
    res.cookie('token', '', { expires: new Date(0) }); 
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports.getLoggedIn = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token" });
        const decoded = jwt.decode(token);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.userId).select('-password');
        if (!user) return res.json({ message: "User not found" });
        res.json({ user, expiresAt: decoded.exp * 1000 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};