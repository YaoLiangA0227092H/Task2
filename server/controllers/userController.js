require("dotenv").config();
const { render } = require('..');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

// Import user model
User = require('../models/userModel');

// Handle register actions
exports.register = async (req, res) => {

    const { name, password, type } = req.body
    if (!(name && password)) {
        res.status(400).json("Both name and password are required.");
    }

    const existingUser = await User.findOne({ name })
    if (existingUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    var user = new User();
    user.name = name
    user.password = encryptedPassword
    user.type = req.body.type ? req.body.type: 0

    // save the user and check for errors
    user.save(function (err) {
        if (err) {
            res.status(400).json(err);
        } else {
            const token = jwt.sign(
                { user_id: user._id, name },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            user.token = token

            res.status(200).json({
                message: 'Register successfully!',
                data: user
            });
        }
    });
};

// Handle login actions
exports.login = async (req, res) => {

    const { name, password } = req.body;
    if (!(name && password)) {
        res.status(400).json("Both name and password are required.");
    }

    const existingUser = await User.findOne({ name })
    if (existingUser && (await bcrypt.compare(password, existingUser.password))) {
        const token = jwt.sign(
            { user_id: existingUser._id, name },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        existingUser.token = token;
        res.status(200).json({
            message: 'Login successfully!',
            data: existingUser
        });
    } else {
        res.status(400).json("Invalid Credentials");
    }
};