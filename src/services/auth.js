import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt-config";
import * as UserService from "../services/user";

export function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
}

export function register(username, password) {
    const create = (user) => {
        if (user) {
            throw new Error('username exists');
        } else {
            return UserService.createUser(username, password);
        }
    };

    return UserService.getUser(username)
        .then(create);
}

export function login(username, password) {
    const check = (user) => {
        if (!user) {
            throw new Error('login failed: user not found');
        } else {
            if (UserService.verifyPassword(user, password)) {
                return new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            _id: user._id,
                            username: username,
                            isAdmin: user.isAdmin
                        },
                        jwtConfig.secret,
                        {
                            expiresIn: '7d'
                        },
                        (err, token) => {
                            if (err) reject(err);
                            resolve(token);
                        });
                });
            } else {
                throw new Error('login failed: invalid password');
            }
        }
    };

    return UserService.getUser(username)
        .then(check);
}