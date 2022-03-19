import express from "express";
import { domainRouter } from "./resources/domain";
import { authRouter } from "./resources/auth";

export const restRouter = express.Router();
restRouter.use("/domain", domainRouter);
restRouter.use("/", authRouter);
