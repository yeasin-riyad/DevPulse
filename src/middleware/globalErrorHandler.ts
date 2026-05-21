import type { NextFunction, Request, Response } from "express";


// normal middleware functions have three parameters: (req, res, next)
// Error handling middleware in Express must have four parameters: (err, req, res, next)
const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default globalErrorHandler;