import nodemailer from 'nodemailer';
import config from './config';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';


export default {
    verifyAccount: (data, url) => {
        var data = JSON.parse(JSON.stringify(data));
        return new Promise((resolve, reject) => {
            // console.log(data.lastName);
            try {
                const filePath = path.join(path.dirname(require.main.filename), 'web', 'resources', 'views', 'emailTemplates', 'welcomeferrum.html');
                const source = fs.readFileSync(filePath, 'utf-8').toString();
                const template = handlebars.compile(source);
                const replacements = {
                    username: data.firstName + ' ' + data.lastName,
                    URL: url
                };
                const html = template(replacements);
                var smtpTransport = nodemailer.createTransport({
                    host: config.mail.host,
                    // service: 'gmail',
                    port: config.mail.port,
                    auth: {
                        user: config.mail.username,
                        pass: config.mail.password
                    },
                    tls: { rejectUnauthorized: false },
                });
                smtpTransport.sendMail({
                    from: config.mail.from,
                    to: data.email,
                    subject: "ACCOUNT ACTIVATION FERRUM",
                    html: html
                }, function(error, info) {
                    if (error) {
                        console.log("error");
                        return reject(new RequestError('Email Sending Failed', 500, error));
                    }
                    // console.log("Email send: ", JSON.stringify(info));
                    return resolve(true)
                })
            } catch (err) {
                resolve(true);
            }
        });
    },

    sendMailToUser: (email, price) => {
        return new Promise((resolve, reject) => {
            try {
                if (email) {
                    var smtpTransport = nodemailer.createTransport({
                        host: config.mail.host,
                        port: config.mail.port,
                        auth: {
                            user: config.mail.username,
                            pass: config.mail.password
                        },
                        tls: { rejectUnauthorized: false },
                    });
                    smtpTransport.sendMail({
                        from: config.mail.from,
                        to: email,
                        subject: 'Congrats! You have opted for the ' + price + ' package!',
                        html: "<!DOCTYPE html> <html> <head> <title></title> </head> <body cz-shortcut-listen='true' style='margin: 0; padding: 0 !important; margin-top: 20px; mso-line-height-rule: exactly; color: black;' width='100%'> <center style='width: 100%;'> <div style='display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;'>&nbsp;</div> <div class='email-container' style='max-width: 600px; margin: 0 auto;'> <div class='overlay'>&nbsp;</div> <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='margin: auto; padding:0px;background: #f4f4f4;' width='100%'> <tbody> <tr> <td class='hero bg_white'  valign='middle'> <table border='0' cellpadding='20' cellspacing='0' width='100%' > <tbody> <!-- center image --> <!--  <div class='overlay'>&nbsp;</div> --> <tr> <td> <br><br> <img width='200px' style='margin-bottom: 0px; border-radius: 5px;' src='https://kdmarc.com/static/images/kdmarc-dark.png'> <br> </td> </tr> </tbody> </table> <table border='0' cellpadding='20' cellspacing='0' width='100%' > <tbody> <!-- paragraph --> <tr> <td> <p style='font-size:24px;margin-bottom: 15px;font-family:Arial;color:black;margin-top: 15px;'><b>Hello,</b></p> <p style='font-size:18px;line-height:27px;font-family:Arial;margin-bottom:0px;color:black;margin-top: 0px;'>Thank  you for raising query related to the tool's pricing. Our team will reach out to you shortly!</p> <p style='font-size:24px;margin-bottom: 15px;font-family:Arial;color:black;margin-top: 15px;'>Congrats! You have opted for the " + price + " package</p> </td> </tr> </tbody> </table> <tr > <td style='text-align: center;'> <img src='https://kdmarc.com/static/images/footer.png' width='100%'> </td> </tr> </td> </tr> </tbody> </table> </div> </center> </body> </html>",
                    }, function(error, info) {
                        if (error) {
                            return reject({
                                name: "PRAException",
                                msg: 'Email Sending Failed'
                            })
                        }
                        // console.log("Email send: ", JSON.stringify(info));
                        return resolve(true)
                    });
                } else throw {
                    name: "PRAException",
                    msg: 'Email Body not available'
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}