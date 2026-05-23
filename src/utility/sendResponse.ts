import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T; // Received any type of data, making it flexible for different responses
  error?:unknown;
};

const sendResponse = <T>(
  res: Response,
  data: TResponse<T>
) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    ...(data.data != undefined && { data: data.data }),
    ...(data.error !== undefined && {error: data.error,})
  });
};

export default sendResponse;