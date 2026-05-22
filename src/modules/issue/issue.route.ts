import express from "express";

import { createIssue } from "./issue.controller";

import auth from "../../middleware/auth";

const issueRouter = express.Router();

issueRouter.post(
  "/",
  auth(),
  createIssue
);

export default issueRouter;