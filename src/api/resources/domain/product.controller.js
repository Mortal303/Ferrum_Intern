import {
    db
} from "../../../models";
var XLSX = require("xlsx");
import path from "path";
var readline = require("readline");
const fs = require('fs');
var util = require('util');
var prodList = require("./prodList.json");
var product = require("./product.json");
var Razorpay = require('razorpay');
import config from '../../../config';
var instance = new Razorpay({
    key_id: config.app.razorPayId,
    key_secret: config.app.razorSecret,
});

var reportPath = path.join(
    path.dirname(require.main.filename),
    "public",
    "bulkFiles"
);

function Token() {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 100; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


var list = async function (req, res, next) {
    try {
        var data = [];
        for (var index = 0; index < prodList.data.length; index++) {
            data.push(prodList.data[index]);
        }
        // console.log(data);
        return res.status(200).json({
            message: "Fetched Data",
            data: data
        });
    } catch (err) {
        return res.status(403).json({
            message: "Some error occured",
            err: err
        });
    }
}

var selectProduct = async function (req, res, next) {
    //console.log(req.body);
    if (req.body.productName) {
        var index, i, found, write, price;
        for (index = 0; index < product.data.length; index++) {
            if (product.data[index].name == req.body.name) {
                found = product.data[index];
                break;
            }
        }
        if (found) {
            //update
            var productData = {
                productName: req.body.productName,
                name: req.body.name,
                address: req.body.address,
                date_time: req.body.date_time,
            }
            product.data[index] = productData;
            write = product;
        } else {
            //create
            var productData = {
                productName: req.body.productName,
                name: req.body.name,
                address: req.body.address,
                date_time: req.body.date_time,
            }
            product.data.push(productData);
            write = product;
        }
        for (i = 0; i < prodList.data.length; i++) {
            if (prodList.data[i].productName == req.body.productName) {
                price = prodList.data[i].price;
                break;
            }
        }
        write.data[index].price = price;
        var orders={ };
        await instance.orders.create({
            amount: price * 100,
            currency: "INR",
            receipt: "receipt#1",
        }, function (err, order) {
            if (err) {
                console.log(err);
            }
            orders = order;
        });
        orders.key_id = config.app.razorPayId;
        return res.status(200).json({
            success: true,
            data: orders
        });
        // console.log(write);
        // fs.writeFileSync("./product.json", util.inspect(write), 'utf-8'); //not workin
    } else {
        return res.status(403).json({
            success: false,
            message: "Null Value Passed"
        });
    }
}

var submitDetail = async function (req, res, next) {
    console.log(req.body);
    return res.status(200).json({
        success: true,
    });
}

var uploadFile = async function (req, res, next) {
    var fileName = req.file.filename;
    if (
        fileName.split(".").pop() == "csv"
    ) {
        var workbook = XLSX.readFile(req.file.path);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var headers = []
        for (const [key, value] of Object.entries(xlData[0])) {
            headers.push(key);
        }
        if (xlData.length !== 0) {
            var token = Token();
            try {
                xlData = [];
                var invoice = await db.invoiceReport.create({
                    userId: req.user.id,
                    filename: req.file.originalname,
                    reportFileName: req.file.filename,
                    token: token,
                    date: Date.now(),
                });
                res.status(200).json({
                    success: true,
                    message: "File Successfully Uploaded",
                    fileName: fileName,
                    token: token
                });
            } catch (error) {
                res.status(403).json({
                    success: true,
                    message: "something went wrong",
                });
            }
        } else {
            return res
                .status(409)
                .json({
                    success: true,
                    message: "File in empty"
                });
        }
    } else {
        res.status(403).json({
            success: true,
            message: "Invalid file format",
        });
    }
};

var registerProduct = async function (req, res, next) {
    var product = await db.registeredProduct.findOne({
        where: {
            barcodeResult: req.body.barcodeResults
        }
    });
    if (!product) {
        try {
            await db.registeredProduct.create({
                userId: req.user.id,
                sno: req.body.sno,
                date: req.body.date,
                productName: req.body.productname,
                barcodeResult: req.body.barcodeResults,
                token: req.body.token
            });
            return res.status(200).json({
                message: "Successfully Registered"
            });
        } catch (error) {
            console.log(error);
            return res.status(409).json({
                message: "Somthing Went Wrong"
            });
        }
    } else {
        return res.status(409).json({
            message: "Product Already Registered"
        });
    }
}

var productList = async function (req, res, next) {
    if (req.user.id) {
        try {
            var list = await db.registeredProduct.findAll({
                where: {
                    userId: req.user.id
                }
            });
            list = JSON.parse(JSON.stringify(list));
            return res.status(200).json({
                result: list,
            });
        } catch (error) {
            console.log(error);
            return res.status(409).json({
                message: "Somthing Went Wrong"
            });
        }
    } else {
        return res.status(409).json({
            message: "Invalid User"
        });
    }
}

var downloadReport = async function (req, res, next) {
    var token = req.params.token;
    var userDetail = await db.invoiceReport.findOne({
        where: {
            token: token
        },
    });
    var data = JSON.parse(JSON.stringify(userDetail));
    if (data) {
        var userDetail = await db.Users.findOne({
            where: {
                id: data.userId
            },
        });
        if (userDetail) {
            try {
                // console.log(data.token);
                // var timeStampInMs = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
                // console.log(Date.now());
                // console.log(timeStampInMs, Date.now());
                const file = reportPath + "/" + data.reportFileName;

                const fileName = data.filename;
                const filePath = reportPath + "/" + fileName;

                if (fs.existsSync(file)) {
                    return res.download(file, filePath); // Set disposition and send it.

                } else {
                    return res
                        .status(404)
                        .json({
                            success: true,
                            message: "File not found"
                        });
                }
            } catch (err) {
                console.log(err);
                return res
                    .status(403)
                    .json({
                        success: true,
                        message: "Something went wrong"
                    });
            }
        } else {
            return res
                .status(409)
                .json({
                    success: true,
                    message: "User does not exits"
                });
        }
    } else {
        return res.status(409).json({
            success: true,
            message: "Invalid link"
        });
    }
};

var registerService = async function (req, res, next) {
    if (req.user.id) {
        var service = await db.registerService.findOne({
            where: {
                productName: req.body.productName
            }
        });
        if (!service) {
            try {
                await db.registerService.create({
                    userId: req.user.id,
                    productName: req.body.productName,
                    serviceType: req.body.serviceType,
                    date: req.body.date,
                    time: req.body.time,
                    address: req.body.address,
                    email: req.body.email,
                    phone: req.body.phone,
                    info: req.body.info,
                    status:'Pending'
                });
                return res.status(200).json({
                    message: "Successfully Registered"
                });
            } catch (error) {
                console.log(error);
                return res
                    .status(403)
                    .json({
                        success: true,
                        message: "Something went wrong"
                    });
            }
        }
    } else {
        return res
            .status(409)
            .json({
                success: true,
                message: "User does not exits"
            });
    }
};

var serviceList = async function (req, res, next) {
    if (req.user.id) {
        try {
            var list = await db.registerService.findAll({
                where: {
                    userId: req.user.id
                }
            });
            list = JSON.parse(JSON.stringify(list));
            return res.status(200).json({
                result: list,
            });
        } catch (error) {
            console.log(error);
            return res.status(409).json({
                message: "Somthing Went Wrong"
            });
        }
    } else {
        return res.status(409).json({
            message: "Invalid User"
        });
    }
}

exports.list = list;
exports.submitDetail = submitDetail;
exports.selectProduct = selectProduct;
exports.uploadFile = uploadFile;
exports.registerProduct = registerProduct;
exports.productList = productList;
exports.downloadReport = downloadReport;
exports.registerService = registerService;
exports.serviceList = serviceList;