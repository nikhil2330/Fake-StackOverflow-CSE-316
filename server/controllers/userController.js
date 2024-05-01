const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            password: hashedPassword 
        });
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

        if (!process.env.JWT_SECRET) {
            console.error('FATAL ERROR: JWT_SECRET is not defined.');
            process.exit(1); // Exit process with failure
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
        await res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7200000 }).status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email
            }
            }).send();

    } catch (error) {
        console.error("Login error:", error); 
        res.status(500).json({ message: "Server error during login." });
    }
};

module.exports.logoutUser = async (req, res) => {
    res.cookie('token', '', { expires: new Date(0) }); 
    res.status(200).json({ message: "Logged out successfully" });
};