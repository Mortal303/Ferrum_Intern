import {
    db
} from "../../../models";
import mailerRegister from "../../../mailerRegister";
const bcrypt = require("bcrypt");


function Token() {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 50; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default {
    async create(req, res, next) {
        let {
            email,
            firstName,
            lastName,
            password,
            mobile
        } = req.body;
        let checkUser = await db.Users.findOne({
            where: {
                email: email
            }
        });
        var userExits = JSON.parse(JSON.stringify(checkUser));
        if (userExits) {
            res.status(422).json({
                success: true,
                message: "user already exist"
            });
        } else {
            const saltRounds = 15;
            const hash = bcrypt.hashSync(password, saltRounds);
            db.Users.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: mobile,
                    password: hash,
                })
                .then((user) => {
                    var user = user;
                    var token = Token();
                    var url =
                        req.protocol + "://" + req.get("host") + "/verify-email/" + token;
                    db.UserVerified.create({
                        userId: user.id,
                        token: token,
                        email: email,
                    }).then((verify) => {
                        // res.status(200).json({ success: true, message: "Created Successfully and verification mail sent to you" });
                        return mailerRegister.verifyAccount(user, url).then((r) => user);
                    });
                })
                .then(async (r) => {
                    return res
                        .status(201)
                        .json({
                            success: true,
                            message: "User successfully created,A verification mail has been sent"
                        });
                })
                .catch((err) => {
                    console.log(err);
                    next(err);
                });
        }
    },
};