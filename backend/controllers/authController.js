import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from 'dotenv'; 
dotenv.config();
const key = process.env.JWT_SECRET

export const register = async(req, resp) => {
    console.log("going to register");

    try {
        const {
            username,
            password,
            emailid
        } = req.body;

        console.log("this is working??");
    
        if (!emailid || emailid.trim() === '') {
            return resp.status(400).json({ message: 'Email is required' });
        }

        const exists = await User.findOne({emailid: emailid});
        if (exists)
            return resp.status(500).json({success: false, message: "Email already registered!"});

        const salt = await bcrypt.genSalt();
        const passwordF = await bcrypt.hash(password, salt); //hashing the password so that it isn't visible in db
        const newUser=new User({
            username,
            emailid,
            password:passwordF,
        });
        const saveUser=await newUser.save();
        
        //jwt token
        const token=jwt.sign({emailid:emailid},key);
        resp.json({success: true,token});
    } catch (error) {
        console.log("error in registering", error);
        resp.status(500).json({"error": error.message});
    }
}

export const login = async (req, resp) => {
    try {
        const {emailid, password} = req.body;
        
        const currentUser = await User.findOne({emailid: emailid});
        if (!currentUser)
            resp.status(500).json({success: false, message: "User not registered! Try making a new account"});

        const compare = await bcrypt.compare(password,currentUser.password);
        if(!compare) {
            console.log("password not match!");
            return resp.status(200).json({success: false, message:"Invalid credentials. Please check again!"});
        }

        const token=jwt.sign({emailid:emailid},key);
        resp.json({success: true,token});
    } catch (error) {
        console.log("error in login", error);
        resp.status(500).json({"error": error.message});
    }
}