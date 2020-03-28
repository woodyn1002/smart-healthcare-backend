import Joi from "joi";
import lodash from "lodash";
import {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import * as AuthService from "../services/auth";

const loggedIn = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;

    if (!token) return res.status(401).json({error: {name: 'UnauthorizedError', message: 'Not logged in.'}});

    AuthService.verify(token)
        .then((decoded) => {
            req.decodedToken = decoded;
            next();
        })
        .catch(err => {
            if (err instanceof TokenExpiredError ||
                err instanceof JsonWebTokenError ||
                err instanceof NotBeforeError) {
                res.status(401).json({error: {name: err.name, message: err.message}});
            } else {
                console.error(err);
                res.status(500).end();
            }
        });
};

const isAdmin = (req, res, next) => {
    const isAdmin = req.decodedToken.isAdmin;

    if (isAdmin) {
        next();
    } else {
        res.status(403).json({error: {name: 'ForbiddenError', message: 'No permission.'}});
    }
};

const canManageUser = (req, res, next) => {
    const {username, isAdmin} = req.decodedToken;

    if (isAdmin || username === req.params.username) {
        next();
    } else {
        res.status(403).json({error: {name: 'ForbiddenError', message: 'No permission.'}});
    }
};

const query = function (schema) {
    return (req, res, next) => validateProperties(req.query, res, next, schema);
};
const params = function (schema) {
    return (req, res, next) => validateProperties(req.params, res, next, schema);
};
const body = function (schema) {
    return (req, res, next) => validateProperties(req.body, res, next, schema);
};

let validateProperties = function (requestProps, res, next, schema) {
    const joiSchema = Joi.object().keys(schema);
    const schemaKeys = Object.keys(schema);

    let requestPropsObj = {};
    for (let key of schemaKeys) {
        requestPropsObj[key] = lodash.get(requestProps, key);
    }

    joiSchema.validate(requestPropsObj, (err) => {
        if (err) return res.status(400).json({error: {name: err.name, message: err.details[0].message}});
        next();
    });
};

const validators = {loggedIn, isAdmin, canManageUser, query, params, body};
export default validators;