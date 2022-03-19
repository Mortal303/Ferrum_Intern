const express = require("express");
const bodyParser = require("body-parser");
import mailerRegister from "../../../mailerRegister";
import { db } from "../../../models";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

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

var sendLink = async function (req, res, next) {
    let { email } = req.body;
    if (email) {
      var userDetail = await db.Users.findOne({
        where: { email: email },
      });
      var data = JSON.parse(JSON.stringify(userDetail));
      if (data.email_verified == 1) {
        return res.status(403).json({
          success: true,
          message: "Your account is already verified",
        });
      } else {
        if (data) {
          var user = data;
          var token = Token();
          var url =
            req.protocol + "://" + req.get("host") + "/verify-email/" + token;
          db.UserVerified.create({
            userId: user.id,
            token: token,
            email: email,
            date: Date.now(),
          })
            .then((verify) => {
              return mailerRegister.verifyAccount(user, url).then((r) => user);
            })
            .then((r) => {
              return res.status(201).json({
                success: true,
                message: "A Verification link has been sent to your registered email address, please verify!",
              });
            })
            .catch((err) => {
              console.log(err);
              next(err);
            });
        } else {
          return res
            .status(403)
            .json({ success: true, message: "Account does not exists" });
        }
      }
    } else {
      return res
        .status(403)
        .json({ success: true, message: "Email address not found" });
    }
  };
  

var emailVerify = async function (req, res, next) {
    var token = req.params.token;
    var userDetail = await db.UserVerified.findOne({
      where: { token: token },
    });
    var data = JSON.parse(JSON.stringify(userDetail));
    if (data) {
      var userDetail = await db.Users.findOne({
        where: { email: data.email },
      });
      if (userDetail) {
        try {
          // console.log(data.token);
          const result = await db.Users.update(
            { email_verified: "1" },
            { where: { email: data.email } }
          );
          return res
            .status(200)
            .json({ success: true, message: "Account verified Successfully" });
        } catch (err) {
          console.log(err);
          return res
            .status(403)
            .json({ success: true, message: "Something went wrong" });
        }
      } else {
        return res
          .status(409)
          .json({ success: true, message: "User does not exist" });
      }
    } else {
      return res
        .status(409)
        .json({ success: true, message: "Token Does not match" });
    }
  };


exports.sendEmailLink = sendLink;
exports.emailVerify = emailVerify;


