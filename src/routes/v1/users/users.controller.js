import * as UserService from "../../../services/user";
import {UserNotFoundError} from "../../../errors";

const respondError = (res, err) => {
    if (err instanceof UserNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

export function getUser(req, res) {
    UserService.getUser(req.params.username)
        .then(user => res.json(user))
        .catch(err => respondError(res, err));
}

export function deleteUser(req, res) {
    UserService.deleteUser(req.params.username)
        .then(() => res.status(204).end())
        .catch(err => respondError(res, err));
}

export function changePassword(req, res) {
    if (!req.body.password) return res.status(400).json({error: 'password required'});

    UserService.changePassword(req.params.username, req.body.password)
        .then(user => res.json(user))
        .catch(err => respondError(res, err));
}