import { pool } from "../../db";
import { IJwtPayload } from "../../types";
import jwt from "jsonwebtoken";
import { IUser } from "./auth.interface";
import config from "../../config";


export const createUserIntoDB= async({name,email,password,role}:IUser)=>{
     const result = await pool.query(
        `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,COALESCE($4,'contributor')) RETURNING *`,
        [name,email,password,role]
    );
    return result;

}

export const getAllUsersFromDB= async()=>{
            const result = await pool.query('SELECT * FROM users');
            return result;

}

export const getUserByEmailFromDB=async(email:string)=>{
            const result = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
            return result;

}

export const generateToken = (
  jwtPayload: IJwtPayload
) => {

  try {

    const token = jwt.sign(
      jwtPayload,
      config.jwt_secret as string,
      {
        expiresIn: "7d",
      }
    );

    return token;

  } catch (error) {

    console.log(error);

    throw new Error("Failed to generate token");
  }
};