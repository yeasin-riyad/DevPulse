import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { IUser } from "./auth.interface";
import {IJwtPayload, IUserResponse} from "../../types/index"
import sendResponse from "../../utility/sendResponse";
import { createUserIntoDB, generateToken, getUserByEmailFromDB } from "./auth.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role="contributor" }:IUser= req.body;

      // Basic Validation
     if (!name || !email || !password || !role) { 
        return sendResponse(res,{
            statusCode:400,
            success:false,
            message:"All fields are required"
        })
    
    }

      // Role Validation
    const allowedRoles: IUser["role"][] = [
  "contributor",
  "maintainer"
];

    if (!allowedRoles.includes(role)) {
      return  sendResponse(res,{
        statusCode:400,
        success:false,
        message:"Invalid role"
       });
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
   return sendResponse(res, {
    statusCode: 400,
    success: false,
    message: "Invalid email format"
  });
}

      // Check Existing User
    const existingUser = await getUserByEmailFromDB(email);

    if (existingUser.rows.length > 0) {
         return sendResponse(res,{
            statusCode:409,
            success:false,
            message:"User already exists"
        })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload:IUser = {
      name,
      email,
    password: hashedPassword,
    role,
    };
    // Insert the user into the database
    const result=await createUserIntoDB(payload);
      delete result.rows[0].password; // Remove password from the response
        return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created successfully!",
      data:result.rows[0] as IUserResponse,
    });
    
}catch(error){
    console.log(error);
   return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:"Internal Server Error",
    });
}
}


export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {

    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email and password are required",
      });
    }

    // Find User
    const result = await getUserByEmailFromDB(email);

    const user = result.rows[0];

    // User Not Found
    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    // Compare Password
    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatched) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
      });
    }

    // JWT Payload
    const jwtPayload:IJwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // Generate Token

     const token = generateToken(jwtPayload);

    // Remove Password
    delete user.password;

    // Response
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token,
        user,
      },
    });

  } catch (error) {

    console.log(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
};
