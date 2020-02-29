import {authService} from "../services/auth";

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;

    if (!token) {
        return res.status(403).json({
            error: 'not logged in'
        });
    }

    const onError = (error) => {
        res.status(403).json({
            error: error.message
        })
    };

    authService.verify(token)
        .then((decoded) => {
            req.token = {decoded};
            next();
        }).catch(onError);
};

export default authMiddleware;