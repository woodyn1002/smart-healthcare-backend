import * as UserService from "../../../services/user";

export function getUser(req, res) {
    UserService.getUser(req.params.username)
        .then((user) => {
            if (!user) return res.status(404).json({error: 'user not found'});
            res.json(user);
        })
        .catch(err => res.status(500).json({error: err}));
}

export function deleteUser(req, res) {
    UserService.getUser(req.params.username)
        .then(user => {
            if (!user) return res.status(404).json({error: 'user not found'});
            return UserService.deleteUser(req.params.username);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
}

export function changePassword(req, res) {
    if (!req.body.password) return res.status(400).json({error: 'password required'});

    UserService.changePassword(req.params.username, req.body.password)
        .then(user => {
            if (!user) return res.status(404).json({error: 'user not found'});
            res.json(user);
        })
        .catch(err => res.status(500).json({error: err}));
}