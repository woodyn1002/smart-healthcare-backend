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

export function getUsers(req, res) {
    UserService.getUsers()
        .then(users => res.json(users))
        .catch(err => respondError(res, err));
}

export function getUser(req, res) {
    const username = req.params.username;

    UserService.getUser(username)
        .then(user => res.json(user))
        .catch(err => respondError(res, err));
}

export function changePassword(req, res) {
    const username = req.params.username;
    const password = req.body.password;

    if (!password) return res.status(400).json({error: 'password required'});

    UserService.changePassword(username, password)
        .then(user => res.json(user))
        .catch(err => respondError(res, err));
}

export function deleteUser(req, res) {
    const username = req.params.username;

    UserService.deleteUser(username)
        .then(() => res.status(204).end())
        .catch(err => respondError(res, err));
}