import express from "express";
import * as AuthService from "../../services/auth";
import {InvalidPasswordError, UsernameExistError, UserNotFoundError} from "../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof UserNotFoundError || err instanceof InvalidPasswordError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof UsernameExistError) {
        res.status(409).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.post('/register',
    (req, res) => {
        const {username, password, email} = req.body;

        AuthService.register(username, password, email)
            .then((user) => res.json(user))
            .catch(err => respondError(res, err));
    });

router.post('/login',
    (req, res) => {
        const {username, password} = req.body;

        AuthService.login(username, password)
            .then(token => res.json({token, message: 'logged in successfully'}))
            .catch(err => respondError(res, err));
    });

export default router;