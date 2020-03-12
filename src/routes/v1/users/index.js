import express from "express";
import healthData from "./health-data";
import meals from "./meals";
import fitness from "./fitness";
import validators from "../../../middlewares/validators";
import Joi from "joi";
import {UserNotFoundError} from "../../../errors";
import * as UserService from "../../../services/user";

const router = express.Router();

router.use('/', healthData);
router.use('/', meals);
router.use('/', fitness);

const respondError = (res, err) => {
    if (err instanceof UserNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        UserService.getUsers()
            .then(users => res.json(users))
            .catch(err => respondError(res, err));
    });

router.get('/:username',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    (req, res) => {
        const username = req.params.username;

        UserService.getUser(username)
            .then(user => res.json(user))
            .catch(err => respondError(res, err));
    });

router.post('/:username/change-password',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    validators.body({
        password: Joi.string().trim().min(6).max(20).required()
    }),
    (req, res) => {
        const username = req.params.username;
        const password = req.body.password;

        if (!password) return res.status(400).json({error: 'password required'});

        UserService.changePassword(username, password)
            .then(user => res.json(user))
            .catch(err => respondError(res, err));
    });

router.delete('/:username',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    (req, res) => {
        const username = req.params.username;

        UserService.deleteUser(username)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;