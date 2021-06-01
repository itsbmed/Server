const joi = require("joi");

const validator = (schema, selectors = {}) => {
    const requiredFields = [];
    const optionalFields = [];
    const forbiddenFields = [];
    schema._ids._byKey.forEach((el) => {
        switch (selectors[el.id]) {
            case 1:
                requiredFields.push(el.id);
                break;
            case 2:
                optionalFields.push(el.id);
                break;
            default:
                forbiddenFields.push(el.id);
        }
    });
    schema = schema.fork(requiredFields, (field) => field.required());
    schema = schema.fork(optionalFields, (field) => field.optional());
    schema = schema.fork(forbiddenFields, (field) => field.forbidden());
    return schema;
};

const agentValidator = async (credentials, selectors) => {
    try {
        let agentSchema = joi.object({
            firstName: joi.string().min(2).max(10).optional(),
            lastName: joi.string().min(2).max(10).optional(),
            userName: joi
                .string()
                .pattern(/[a-zA-Z0-9\-\_]{4,6}/)
                .message("Please fill a valid username")
                .required(),
            passWord: joi.string().required().min(4).max(16),
        });
        agentSchema = validator(agentSchema, selectors);
        return await agentSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};

const patientValidator = async (credentials, selectors) => {
    try {
        let patientSchema = joi.object({
            ipp: joi.number().min(6).required(),
            firstName: joi.string().min(2).max(10),
            lastName: joi.string().min(2).max(10),
            nCode: joi.number().max(20).optional().default(null),
            nDate: joi.date().optional().default(null),
        });
        patientSchema = validator(patientSchema, selectors);
        return await patientSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
module.exports = {
    agentValidator,
    patientValidator,
};
