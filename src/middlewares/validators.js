import {authService} from "../services/auth";

const loggedIn = (req, res, next) => {
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

const isAdmin = (req, res, next) => {
    if (req.token.decoded.isAdmin) {
        next();
    } else {
        res.status(403).json({
            error: 'no permission'
        });
    }
};

const canManageUser = (req, res, next) => {
    let isAdmin = req.token.decoded.isAdmin;
    if (isAdmin || req.token.decoded.username === req.params.username) {
        next();
    } else {
        res.status(403).json({
            error: 'no permission'
        });
    }
};

const validators = {loggedIn, isAdmin, canManageUser};
export default validators;