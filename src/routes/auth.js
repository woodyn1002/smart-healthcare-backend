import express from "express";
import {authService} from "../services/auth";

const router = express.Router();

router.post('/register', function (req, res) {
    const {username, password} = req.body;

    const respond = (user) => {
        res.json(user);
    };

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        });
    };

    authService.register(username, password)
        .then(respond)
        .catch(onError);
});

router.post('/login', function (req, res) {
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

    authService.login(username, password)
        .then(respond)
        .catch(onError);
});

export default router;