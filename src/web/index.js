import express from "express";
import { homeRouter } from "./resources/modules/home";

export const webRouter = express.Router();
webRouter.use("/", [
  homeRouter,
]);
