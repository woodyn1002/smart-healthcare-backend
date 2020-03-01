import express from "express";
import * as AuthService from "../../services/auth";
import {InvalidPasswordError, UsernameExistError, UserNotFoundError} from "../../errors";

const router = express.Router();

router.post('/register',
    (req, res) => {
        const {username, password, email} = req.body;

        const respond = (user) => {
            res.json(user);
        };

        const onError = (err) => {
            if (err instanceof UsernameExistError)
                res.status(409).json({error: err.name, message: err.message});
            else {
                console.error(err);
                res.status(500).end();
            }
        };

        AuthService.register(username, password, email)
            .then(respond)
            .catch(onError);
    });

router.post('/login',
    (req, res) => {
        const {username, password} = req.body;

        const respond = (token) => {
            res.json({
                message: 'logged in successfully',
                token
            });
        };

        const onError = (err) => {
            if (err instanceof UserNotFoundError || err instanceof InvalidPasswordError)
                res.status(403).json({error: err.name, message: err.message});
            else {
                console.error(err);
                res.status(500).end();
            }
        };

        AuthService.login(username, password)
            .then(respond)
            .catch(onError);
    });

export default router;