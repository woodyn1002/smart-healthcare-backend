import {userService} from "../../services/user";

class UserController {
    getUser(req, res) {
        userService.getUser(req.params.username)
            .then((user) => {
                if (!user) return res.status(404).json({error: 'user not found'});
                res.json(user);
            })
            .catch(err => res.status(500).json({error: err}));
    }

    deleteUser(req, res) {
        userService.getUser(req.params.username)
            .then(user => {
                if (!user) return res.status(404).json({error: 'user not found'});
                return userService.deleteUser(req.params.username);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    }

    changePassword(req, res) {
        if (!req.body.password) return res.status(400).json({error: 'password required'});

        userService.changePassword(req.params.username, req.body.password)
            .then(user => {
                if (!user) return res.status(404).json({error: 'user not found'});
                res.json(user);
            })
            .catch(err => res.status(500).json({error: err}));
    }
}

export let controller = new UserController();