const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const router = express.Router();
const url = require('url');
const app = express();

function verifyTokenAPI(req, resp, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const setToken = bearerHeader.split(' ');
        const Token = setToken[1];
        req.token = Token;
        jwt.verify(req.token, 'jwt', (err, authData) => {
            if (err) {
                // resp.redirect('/login');
                resp.status(403).json({ message: err })
            } else {
                next();
            }
        })
    } else {
        // resp.redirect('login');
        resp.status(403).json({
            message: "Token not found"
        });
    }
}

function verifyTokenWeb(req, resp, next) {
    var token = null;

    if (req && req.cookies) {
        token = req.cookies['XSRF-token'];
        jwt.verify(token, jwtKey, (err, authData) => {
            if (err) {
                resp.redirect('/login');
                // resp.status(403).json({ message: err })
            } else {
                next();
            }
        });
    } else {
        resp.redirect('login');
        // resp.status(403).json({
        //     message: "Token not found"
        // });
    }
}





var TokenExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['XSRF-token'];
    }
    return token;
}
exports.TokenExtractor = TokenExtractor;
exports.verifyTokenAPI = verifyTokenAPI;
exports.verifyTokenWeb = verifyTokenWeb;