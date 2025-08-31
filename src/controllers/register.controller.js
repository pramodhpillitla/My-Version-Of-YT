import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser= asyncHandler(async (req,res)=>{
    //recieve data from the user 
    const {fullName,email,username,password} = req.body;
    console.log("email:",email,"\nfullName :",fullName,"\nusername:",username);
    
    //check if any of the fields are empty 
    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }
    //check if the user is already existed
    const existedUser =await User.findOne(
        {$or :[{username},{email}]}
    )

    if(existedUser){
        throw new ApiError(409,"User with same username or email exists");
    }
    
    //handle the files that are uploaded : avatar and coverImage

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required");
    }

    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(500,"ERROR IN UPLOADING THE AVATAR. PLEASE RE-UPLOAD");
    }

    //store the user in the databasse 

    const user = await User.create(
        {
            avatar:avatar.url,
            coverImage: coverImage?.url || "",
            fullName : fullName,
            email: email,
            username : username.toLowerCase(),
            password: password,
        }
    )

    // checking if the database is updated by getting the user from the db without password and refreshtokenz
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"ERROR IN UPDATING THE USER TO THE DATABASE")
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"user is successfully registered!")
    )
    




})

export {registerUser};