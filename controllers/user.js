import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.js";
dotenv.config();

export const signup = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email});

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

        const saltRounds = 10;
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        catch(err) {
            return res.status(500).json({
                success: false,
                message: 'Error while hashing the password',
            });
        }

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully',
        })
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: 'Database connection error',
        });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password required',
            })
        }
        
        let user = await User.findOne({ email });
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        // Compare the password ----> await bcrypt.compare(password, user.password)
        if(await bcrypt.compare(password, user.password)) {
            // Create a token
            let token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h'
            })

            // Remove the password from the user object
            user = user.toObject();
            delete user.password;
            user.token = token;

            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie('token', token, options).status(200).json({
                success: true,
                data: user,
                token: token
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Incorrect password',
            })
        }
    }
    catch(err) {
        res.status(500).json({
            success: false,
            message: 'Server connection error',
        });
    }
}