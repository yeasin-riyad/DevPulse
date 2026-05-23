import express from "express";

import { createIssue, deleteIssue, getAllIssues, getSingleIssue, updateIssue } from "./issue.controller";

import auth from "../../middleware/auth";

const issueRouter = express.Router();

issueRouter.post("/",auth(),createIssue);
issueRouter.get("/", getAllIssues)
issueRouter.get("/:id", getSingleIssue);
issueRouter.patch("/:id",auth(),updateIssue);
issueRouter.delete("/:id",auth(),deleteIssue);

export default issueRouter;