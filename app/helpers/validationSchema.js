const joi = require("joi");

const validator = (schema, selectors = {}, options) => {
    if (options?.merge) {
        schema = schema.concat(options.merge);
    }
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

const agentValidator = async (credentials, selectors, options = {}) => {
    try {
        let agentSchema = joi.object({
            firstName: joi.string().min(2).max(10).optional().trim(),
            lastName: joi.string().min(2).max(10).optional().trim(),
            userName: joi
                .string()
                .pattern(/[a-zA-Z0-9\-\_]{4,6}/)
                .message("Please fill a valid username")
                .required()
                .trim(),
            passWord: joi.string().required().min(4).max(16),
            isAdmin: joi.boolean().default(false),
            page: joi.number().greater(0).default(1),
        });
        agentSchema = validator(agentSchema, selectors, options);
        return await agentSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};

const patientValidator = async (credentials, selectors, options = {}) => {
    try {
        let patientSchema = joi.object({
            ipp: joi.number().min(100000).required(),
            firstName: joi.string().min(2).max(30).trim(),
            lastName: joi.string().min(2).max(30).trim(),
            page: joi.number().greater(0).default(1),
        });
        patientSchema = validator(patientSchema, selectors, options);
        return await patientSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
const episodeValidator = async (credentials, selectors, options = {}) => {
    try {
        let episodeSchema = joi.object({
            id: joi.number(),
            patientId: joi.number().min(100000).required(),
            firstName: joi.string().min(2).max(30),
            lastName: joi.string().min(2).max(30),
            cin: joi.string().min(8).max(10),
            address: joi.string().max(255),
            type: joi.string().uppercase().valid("EXTERNAL", "HOSPITALIZED"),
            entryDate: joi.date(),
            exitDate: joi.date(),
            admType: joi.string().uppercase().valid("URGENT", "NORMAL"),
            ramedExpDate: joi.date(),
            ramedNum: joi
                .string()
                .regex(/[0-9]{4,20}/)
                .message("Please fill a valid remedNum !"),
            category: joi
                .string()
                .uppercase()
                .valid(
                    "PAID",
                    "POTENTIAL",
                    "RAMED",
                    "CNOPS",
                    "MAFAR",
                    "CNSS",
                    "PERSONNEL",
                    "ORGANISM"
                ),
            presentationNature: joi
                .string()
                .uppercase()
                .valid("LAB", "RADIO", "CONSULTATION"),
            service: joi
                .string()
                .uppercase()
                .valid(
                    "P1",
                    "P2",
                    "P3",
                    "P4",
                    "P5",
                    "CHA",
                    "CHB",
                    "CHC",
                    "CHOP",
                    "UPM",
                    "UPC",
                    "REAA",
                    "REAB"
                ),
            hospitalDay: joi.boolean(),
            page: joi.number().greater(0).default(1),
            from: joi.date(),
            to: joi.date().greater(joi.ref("from")),
        });
        episodeSchema = validator(episodeSchema, selectors, options);
        return await episodeSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
let billSchema = joi.object({
    id: joi.number(),
    episodeId: joi.number(),
    organismPart: joi.number().default(0),
    adherentPart: joi.number().default(0),
    billNum: joi.string().min(4).max(10),
    medicalBiology: joi.number().default(0),
    medicalImaging: joi.number().default(0),
    prosthesis: joi.number().default(0),
    invoicedStay: joi.number().default(0),
    medicalFees: joi.number().default(0),
    billedMedication: joi.number().default(0),
    actes: joi.number().default(0),
    total: joi.number().default(0),
    totalOf: joi
        .string()
        .lowercase()
        .valid(
            "medicalbiology",
            "medicalimaging",
            "prosthesis",
            "invoicedstay",
            "medicalfees",
            "billedmedication",
            "actes",
            "total"
        ),
    page: joi.number().greater(0).default(1),
});
const billValidator = async (credentials, selectors, options = {}) => {
    try {
        billSchema = validator(billSchema, selectors, options);
        return await billSchema.validateAsync(credentials);
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
    episodeValidator,
    billValidator,
    billSchema,
};
