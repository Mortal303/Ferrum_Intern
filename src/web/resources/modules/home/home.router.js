import express from "express";
import homeController from "./home.controller";
import {
    jwtStrategy
  } from "../../../../middleware/strategy";
  import {
    jwtLogoutStrategy
  } from "../../../../middleware/strategy";
  import {
    userImplant
  } from "../../../../middleware/auth";
  import {
    loginCheck
  } from "../../../../middleware/auth";

export const homeRouter = express.Router();
homeRouter.route(["/"]).get(jwtStrategy, userImplant, homeController.index);
homeRouter.route(["/register_product"]).get(jwtStrategy, userImplant, homeController.registerProduct);
homeRouter.route(["/service-page"]).get(jwtStrategy, userImplant, homeController.servicePage);
homeRouter.route(["/service-details"]).get(jwtStrategy, userImplant, homeController.serviceDetail);
homeRouter.route(["/track-service"]).get(jwtStrategy, userImplant, homeController.trackService);
homeRouter.route(["/payment"]).get(jwtStrategy, userImplant, homeController.payment);
homeRouter.route(["/success"]).get(jwtStrategy, userImplant, homeController.success);
homeRouter.route(["/register"]).get(homeController.register);
homeRouter.route(["/login"]).get(loginCheck(), homeController.login);
homeRouter.route(["/forgotpassword"]).get(homeController.forgotpassword);
homeRouter.route("/reset-password/:token").get(homeController.resetPassword);
homeRouter.route("/logout").get(jwtLogoutStrategy);
homeRouter.route("/verify-email/:token").get(homeController.emailVerify);
homeRouter.route("/verify-account").get(homeController.verifyAccount);


