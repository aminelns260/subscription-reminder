import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"

export const signUp = async (req, res, next) => {
    // Start Session
    const session = await mongoose.startSession()
    // Start Transaction
    session.startTransaction()

    try {

        // Get Data from the Request
        const { name, email, password } = req.body;

        // Check if User exists
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new Error("User already exists")
            error.statusCode = 409
            throw error;
        }

        // Gen Salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new User
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        // Send Response
        res.status(201).json({
            success: true,
            message: 'User created successfuly',
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (err) {
        // If Error : Aboart Transaction, then End Session, Send Err
        await session.abortTransaction();
        await session.endSession();
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error)
    }
}

