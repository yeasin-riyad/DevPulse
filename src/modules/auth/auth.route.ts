import { Router } from "express";
import { createUser, loginUser } from "./auth.controller";

export const authRouter=Router();

authRouter.post("/signup",createUser);
authRouter.post("/login",loginUser);

