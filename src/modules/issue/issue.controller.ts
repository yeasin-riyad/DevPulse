import type {
  Request,
  Response,
} from "express";

import sendResponse from "../../utility/sendResponse";

import { IIssue } from "./issue.interface";

import { createIssueIntoDB } from "./issue.service";

export const createIssue = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      title,
      description,
      type,
    }: IIssue = req.body;

    // Reporter From JWT
    const reporter_id = req.user?.id;

    // Validation
    if (
      !title ||
      !description ||
      !type
    ) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "All fields are required",
      });
    }

    // Title Length Validation
    if (title.length > 150) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          "Title cannot exceed 150 characters",
      });
    }

    // Description Validation
    if (description.length < 20) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          "Description must be at least 20 characters",
      });
    }

    // Type Validation
    const allowedTypes = [
      "bug",
      "feature_request",
    ];

    if (!allowedTypes.includes(type)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue type",
      });
    }

    // Payload
    const payload: IIssue = {
      title,
      description,
      type,
      reporter_id,
    };

    // Create Issue
    const result =
      await createIssueIntoDB(payload);

    // Response
    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Issue created successfully",
      data: result.rows[0],
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