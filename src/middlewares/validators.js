import * as AuthService from "../services/auth";

const loggedIn = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;

    if (!token) return res.status(401).json({error: 'UnauthorizedError', message: 'Not logged in.'});

    AuthService.verify(token)
        .then((decoded) => {
            req.decodedToken = decoded;
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
};

const isAdmin = (req, res, next) => {
    const isAdmin = req.decodedToken.isAdmin;

    if (isAdmin) {
        next();
    } else {
        res.status(403).json({error: 'ForbiddenError', message: 'No permission.'});
    }
};

const canManageUser = (req, res, next) => {
    const {username, isAdmin} = req.decodedToken;

    if (isAdmin || username === req.params.username) {
        next();
    } else {
        res.status(403).json({error: 'ForbiddenError', message: 'No permission.'});
    }
};

const validators = {loggedIn, isAdmin, canManageUser};
export default validators;