import type {
  Request,
  Response,
  NextFunction,
} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import sendResponse from "../utility/sendResponse";
const auth = () => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {
      const token = req.headers.authorization;

      if (!token) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access",
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string
      )as JwtPayload;

      req.user = decoded;

      next();

    } catch (error) {

      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid Token",
      });
    }
  };
};

export default auth;