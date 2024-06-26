const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    return !string || string.trim() === '';
}

const signup = async (req, res) => {
    try {
        const { name, email, phonenumber, password } = req.body;

        // Check if any required field is missing
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phonenumber) || isStringInvalid(password)) {
            return res.status(400).json({ err: "Bad parameters - Something is missing" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ err: "User already exists" });
        }

        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        await User.create({ name, email, phonenumber, password: hashedPassword });
        res.status(201).json({ message: 'Successfully created new user' });
    } catch (err) {
        console.error('Error in signup:', err);
        res.status(500).json({ err: "Internal Server Error" });
    }
}

function generateAccessToken(id, name) {
    return jwt.sign({ userid: id, name: name }, process.env.TOKEN_SECRET);
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: 'Email or password is missing', success: false });
        }

        // Find the user by email
        const user = await User.findOne({ where: { email: email } });

        // If user doesn't exist, return 404
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If the password is valid, generate a JWT and send it to the frontend
        if (isPasswordValid) {
            const token = generateAccessToken(user.id, user.name);
            console.log('Generated token:', token);
            return res.status(200).json({ message: 'User logged in successfully', success: true, token: token });
        } else {
            // If the password is not valid, return 401
            return res.status(401).json({ message: 'User not authorized', success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


module.exports = {
    signup: signup,
    login: login,
    generateAccessToken: generateAccessToken,
};