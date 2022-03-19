import express from "express";
import productController from "./product.controller";
import {
  sanitize
} from "../../../middleware/sanitizer";
import {
  jwtStrategy
} from "../../../middleware/strategy";
var multer = require("multer");
import path from "path";

export const domainRouter = express.Router();

var attachmentDir = path.join(
  path.dirname(require.main.filename),
  "public",
  "bulkFiles"
);

var storage = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.extname(file.originalname).match(/\.(csv)$/)) {
      cb(null, true);
    } else {
      return cb(new Error("Only .csv, .ods .xls and .xlsx format allowed!"));
    }
  },
  destination: function (req, file, cb) {
    cb(null, attachmentDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var uploadAttachment = multer({
  storage: storage,
  limits: {
    fileSize: 100485760
  },
});

domainRouter
  .route("/product/list")
  .get(sanitize(),
    jwtStrategy, productController.list);

domainRouter
  .route("/product/selectProduct")
  .post(sanitize(),
    jwtStrategy, productController.selectProduct);

domainRouter
  .route("/product/submitDetail")
  .post(sanitize(),
    jwtStrategy, productController.submitDetail);

domainRouter
  .route("/upload-file")
  .post(
    sanitize(),
    jwtStrategy,
    uploadAttachment.single("bulkFile"),
    productController.uploadFile
  );

domainRouter
  .route("/product/registerProduct")
  .post(sanitize(),
    jwtStrategy, productController.registerProduct);


domainRouter
  .route("/product/productList")
  .get(sanitize(),
    jwtStrategy, productController.productList);

domainRouter
  .route("/report-download/:token")
  .get(sanitize(),
    jwtStrategy, productController.downloadReport);

domainRouter
  .route("/product/registerService")
  .post(sanitize(),
    jwtStrategy, productController.registerService);

domainRouter
  .route("/product/serviceList")
  .get(sanitize(),
    jwtStrategy, productController.serviceList);