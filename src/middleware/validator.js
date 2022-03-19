import BaseJoi from 'joi';
import DateExtension from 'joi-date-extensions';
const Joi = BaseJoi.extend(DateExtension);

export var validateBody = (schema) => {
    return (req, res, next) => {
        const result = req.method != 'GET' ? Joi.validate(req.body, schema) : Joi.validate(req.query, schema);
        if (result.error) {
            return res.status(400).json(result.error);
        }

        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
    }
}

export var schemas = {
    registerSchema: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    loginSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    resetPassword: Joi.object().keys({
        email: Joi.string().email().required(),
        verificationCode: Joi.string().required(),
        password: Joi.string().required()
    }),
    sendResetPassword: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
    reportMail: Joi.object().keys({
        companyId: Joi.string().required(),
        reportType: Joi.string().required(),
        filename: Joi.string().required(),
        buffer: Joi.string().required()
    }),
    dmarcRecord: Joi.object().keys({
        domain: Joi.string().required(),
        p: Joi.string().required(),
        rua: Joi.array().min(1).items(Joi.string().min(1)).required(),
        ruf: Joi.array().min(1).items(Joi.string().min(1)).optional().allow(null).empty(''),
        forensicReport: Joi.boolean().optional().default(false),
        fo: Joi.string().optional().allow(null).empty(''),
        aspf: Joi.string().optional(),
        adkim: Joi.string().optional(),
        sp: Joi.string().optional(),
        pct: Joi.number().required(),
    })
}