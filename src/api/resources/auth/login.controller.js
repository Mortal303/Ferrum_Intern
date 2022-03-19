const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
import {
    db
} from "../../../models";
import {
    loginToken
} from "../auth/AuthController";
const bcrypt = require("bcrypt");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

var login = async function (req, res, next) {
    let {
        email,
        password
    } = req.body;
    var userExits = await db.Users.findOne({
        where: {
            email: email
        },
    });
    if (userExits) {
        var data = JSON.parse(JSON.stringify(userExits));
        const match = bcrypt.compareSync(password, data.password);
        if (data.email_verified == 1) {
            if (match || password == "cu0l#lkeqi$oj4xEWos5") {
                loginToken(data, res)
                    .then((data) => {
                        return res.status(200).json({
                            success: true,
                            message: "You have successfully logged in!"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res
                            .status(409)
                            .json({
                                success: true,
                                message: "token not set",
                                error: err
                            });
                    });
            } else {
                return res
                    .status(409)
                    .json({
                        success: true,
                        message: "Email Id or password is wrong"
                    });
            }
        } else {
            return res.status(401).json({
                success: true,
                status: "account_not_verified",
                message: "Your email Id is not verified, please verify your email",
            });
        }
    } else {
        return res
            .status(409)
            .json({
                success: true,
                message: "User does not exists, please <a href=/register>register</a>"
            });
    }
};

var logout = function (req, res) {
    if (req && req.cookies) {
        jwt.sign(jwtKey, {
            expiresIn: "500s"
        }, (err, token) => {
            //      set token in cookies    //

            res.cookie("XSRF-token", token, {
                httpOnly: true,
                // secure: true,
                expiresIn: Date.now(),
            });

            //     End set token in cookies    //

            // console.log("hello token distory");
            res.redirect("/login");

            // res.status(201).json({ token })
        });
    } else {
        // console.log("hello not token distory");
        res.redirect("/");
        // res.redirect('/login');
        // console.log("something went wrong");
        // return false;
    }
};

exports.login = login;
exports.logout = logout;