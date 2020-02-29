import express from "express";
import * as AuthService from "../../services/auth";

const router = express.Router();

router.post('/register',
    (req, res) => {
        const {username, password} = req.body;

        const respond = (user) => {
            res.json(user);
        };

        const onError = (error) => {
            res.status(409).json({
                message: error.message
            });
        };

        AuthService.register(username, password)
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
            res.status(403).json({
                message: err.message
            });
        };

        AuthService.login(username, password)
            .then(respond)
            .catch(onError);
    });

export default router;