import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt-config";
import * as UserService from "../services/user";
import {InvalidPasswordError, UserNotFoundError} from "../errors";

export function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
}

export function register(username, password, email, isAdmin) {
    return UserService.createUser(username, password, email, isAdmin);
}

export function login(username, password) {
    const check = (user) => {
        if (!user) {
            throw new UserNotFoundError(`Username ${username} was not found.`);
        } else {
            if (UserService.verifyPassword(user, password)) {
                return new Promise((resolve, reject) => {
                    jwt.sign(
                        {
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
                throw new InvalidPasswordError();
            }
        }
    };

    return UserService.getUser(username)
        .then(check);
}