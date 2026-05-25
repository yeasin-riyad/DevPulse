import type {
  Request,
  Response,
} from "express";

import sendResponse from "../../utility/sendResponse";

import { IIssue,IGetIssuesQuery,IIssueWithReporter, IssueSort, IssueType, IssueStatus, } from "./issue.interface";

import { createIssueIntoDB,deleteIssueFromDB,getAllIssuesFromDB, getSingleIssueFromDB, updateIssueIntoDB } from "./issue.service";
import { pool } from "../../db";
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

export const getAllIssues = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      sort = "newest",
      type,
      status,
    } = req.query;

    const allowedSorts: IssueSort[] = [
  "newest",
  "oldest",
];
const allowedTypes: IssueType[] = [
  "bug",
  "feature_request",
];

const allowedStatuses: IssueStatus[] = [
  "open",
  "in_progress",
  "resolved",
];

if (
  sort &&
  !allowedSorts.includes(
    sort as IssueSort
  )
) {
  return sendResponse(res, {
    statusCode: 400,
    success: false,
    message: "Invalid sort value",
  });
}

if (
  type &&
  !allowedTypes.includes(
    type as IssueType
  )
) {
  return sendResponse(res, {
    statusCode: 400,
    success: false,
    message: "Invalid type value",
  });
}

if (
  status &&
  !allowedStatuses.includes(
    status as IssueStatus
  )
) {
  return sendResponse(res, {
    statusCode: 400,
    success: false,
    message: "Invalid status value",
  });
}

 // Filters Object
    const filters: IGetIssuesQuery = {
      sort: sort as IssueSort,
      type: type as IssueType,
      status: status as IssueStatus,
    };


    const result =await getAllIssuesFromDB(filters);

    return sendResponse<IIssueWithReporter[]>(res, {
      statusCode: 200,
      success: true,
      data: result,
    });

  } catch (error) {

    console.log(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:"Internal Server Error",
    });
  }
};

export const getSingleIssue = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    // Invalid ID Check
    if (isNaN(id)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    // Fetch Issue
    const result =await getSingleIssueFromDB(id);
    // Not Found
    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    // Success Response
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      data: result,
    });

  } catch (error) {

    console.log(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        "Internal Server Error",
    });
  }
};

export const updateIssue = async (
  req: Request,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    // Invalid ID
    if (isNaN(id)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    // Existing Issue
    const existingIssue =
      await getSingleIssueFromDB(id);

    // Issue Not Found
    if (!existingIssue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    // Current User
    const currentUser = req?.user;

    /*
      Authorization Rules

      Maintainer:
      - Can update any issue

      Contributor:
      - Can update own issue only
      - Status must be open
    */


    if (
      currentUser?.role ===
      "contributor"
    ) {

      // Own Issue Check
      if (
        existingIssue?.reporter?.id!==
        currentUser.id
      ) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message:
            "You can update only your own issues",
        });
      }

      // Status Check
      if (
        existingIssue.status !==
        "open"
      ) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message:
            "You can update only open issues",
        });
      }
    }

    // Request Body
    const {
      title,
      description,
      type,
    }: Partial<IIssue> = req.body;

    // Validation
    if (
      !title &&
      !description &&
      !type
    ) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          "At least one field is required",
      });
    }

    // Title Validation
    if (
      title &&
      title.length > 150
    ) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          "Title cannot exceed 150 characters",
      });
    }

    // Description Validation
    if (
      description &&
      description.length < 20
    ) {
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

    if (
      type &&
      !allowedTypes.includes(type)
    ) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue type",
      });
    }

    // Payload
    const payload: Partial<IIssue> = {
      title:
        title ??
        existingIssue.title,

      description:
        description ??
        existingIssue.description,

      type:
        type ??
        existingIssue.type,
    };

    // Update Issue
    const result =
      await updateIssueIntoDB(
        id,
        payload
      );


    // Response
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Issue updated successfully",
      data: result,
    });

  } catch (error) {

    console.log(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:
        "Internal Server Error",
    });
  }
};



export const deleteIssue = async (
  req: Request,
  res: Response
) => {

  try {

    // Current User
    const currentUser = req.user;

    // Role Check
    if (
      currentUser?.role !==
      "maintainer"
    ) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message:
          "Only maintainer can delete issues",
      });
    }

    // Issue ID
    const id = Number(req.params.id);

    // Invalid ID
    if (isNaN(id)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid issue id",
      });
    }

    // Existing Issue
    const existingIssue =await getSingleIssueFromDB(id);

    // Not Found
    if (!existingIssue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    // Delete Issue
    await deleteIssueFromDB(id);

    // Success Response
    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message:"Issue deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message:"Internal Server Error",
    });
  }
};