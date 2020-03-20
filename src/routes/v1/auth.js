import express from "express";
import Joi from "joi";
import * as AuthService from "../../services/auth";
import {InvalidPasswordError, UsernameExistError, UserNotFoundError} from "../../errors";
import validators from "../../middlewares/validators";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof UserNotFoundError || err instanceof InvalidPasswordError || err instanceof UsernameExistError) {
        res.status(401).json({error: {name: err.name, message: err.message}});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.post('/register',
    validators.body({
        username: Joi.string().trim().alphanum().min(6).max(16).required(),
        password: Joi.string().trim().min(6).max(20).required(),
        email: Joi.string().trim().email().required(),
        fullName: Joi.string().required(),
    }),
    (req, res) => {
        const {username, password, email, fullName} = req.body;

        AuthService.register(username, password, email, fullName)
            .then((user) => res.status(201).json(user))
            .catch(err => respondError(res, err));
    });

router.post('/login',
    validators.body({
        username: Joi.string().trim().required(),
        password: Joi.string().trim().required()
    }),
    (req, res) => {
        const {username, password} = req.body;

        AuthService.login(username, password)
            .then(result => {
                const response = result.user.toJSON();
                response.token = result.token;
                res.json(response);
            })
            .catch(err => respondError(res, err));
    });

export default router;