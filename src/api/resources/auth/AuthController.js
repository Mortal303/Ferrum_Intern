const express = require('express');
const bodyParser = require('body-parser');
const jwtToken = require('../../../middleware/strategy');
import config from '../../../config';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


var login = async function(req, res) {
    var date = new Date();
    var token = jwtToken.JWTSign(req, date);
    res.cookie('XSRF-token', token, {
        expire: new Date().setMinutes(date.getMinutes() + 60),
        httpOnly: true,
        secure: config.app.secure
    });
    return ;
}
exports.loginToken = login;