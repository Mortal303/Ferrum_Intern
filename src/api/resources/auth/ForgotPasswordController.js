const express = require('express');
const bodyParser = require('body-parser');
import mailerForgotPassword from '../../../mailerForgotPassword.js';
import { db } from '../../../models';
const bcrypt = require('bcrypt');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


function Token() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 50; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


var sendLink = async function(req, res, next) {
    let { email } = req.body;
    if (email) {
        var userDetail = await db.Users.findOne({
            where: { email: email }
        });
        var data = JSON.parse(JSON.stringify(userDetail));
        if (data) {
            var user = data;
            var token = Token();
            var url = req.protocol + "://" + req.get('host') + '/reset-password/' + token;
            db.forgotPassword.create({
                userId: user.id,
                token: token,
                email: email,
                date: Date.now()
            }).then(verify => {
                return mailerForgotPassword.resetPassword(user, url).then(r => user);
            }).then(r => {
                res.status(201).json({ success: true, message: "successfully send link to you register email address" });
            }).catch((err) => {
                console.log(err);
                next(err)
            })
        } else {
            return res.status(403).json({ success: true, message: "Account does not exists" });
        }
    } else {
        return res.status(403).json({ success: true, message: "Email address not found" });
    }
}


var resetPassword = async function(req, res, next) {
    let {password, c_password, token } = req.body;
    if (token) {
        if (password == c_password) {
            var userDetail = await  db.forgotPassword.findOne({
                where: { token: token }
            });
            var data = JSON.parse(JSON.stringify(userDetail));
            if (data) {
                var userDetail = await  db.Users.findOne({
                    where: { id: data.userId }
                });

                if (userDetail) {
                    try {
                        // console.log(data.token);
                    const saltRounds = 15; 
                    const hash = bcrypt.hashSync(password, saltRounds);
                    const result = await db.Users.update(
                        { password: hash },
                        { where: { id: data.userId } 
                        });
                        return res.status(200).json({ success: true, message: "Successfully reset you account password" });
                    } catch (err) {
                        console.log(err);
                            return res.status(403).json({ success: true, message: "Something went wrong" });
                    }
                } else {
                    return res.status(409).json({ success: true, message: "User does not exits" });
                }
            } else {
                return res.status(409).json({ success: true, message: "Token Does not match" });
            }
        } else {
            return res.status(403).json({ success: true, message: "Password Does not match" });
        }
        
    } else {
        return res.status(403).json({ success: true, message: "Token not found" });
    }
}


exports.sendLink = sendLink;
exports.resetPassword = resetPassword;