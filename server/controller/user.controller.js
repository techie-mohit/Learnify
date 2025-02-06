import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import { deleteMedia, uploadMedia } from '../utils/cloudinary.js';


export const register = async(req, res) =>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email|| !password){
            res.status(400).json({
                success: false,
                message: "All fields are required. "
            })
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message: "Already User Exists"
            })
        }
        const hashPassword = await bcrypt.hash(password, 12);
        await User.create({
            name,
            email,
            password:hashPassword
        })

        return res.status(201).json({
            success: true,
            message: "User created successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}


export const login = async(req, res) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        generateToken(res, user, `Welcome back ${user.name}`)   


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })

        
    }
}

export const logout = async(req, res)=>{
    try{
        return res.status(200).cookie("token", "", {MaxAge:0}).json({
            success:true,
            message:"Logged out successfully"
        });  

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Logout"
        })
    }
}


export const getUserProfile = async(req,res)=>{
    try {
        const userId = req.id;   // In middleware isAuthenticated we have set req.id = decode.userId means if user ids LoggedIn then its id will be save in req.id
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            user
        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to get user profile"
        })
        
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;
        const {role} = req.body;

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        // extract publicId of old image from the url is it exists
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];   // extract publicId from the url
            deleteMedia(publicId);
        }

        // upload new photo 
        const uploadResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = uploadResponse.secure_url;

        const updatedData = {name, photoUrl,role};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
        
    }
}

