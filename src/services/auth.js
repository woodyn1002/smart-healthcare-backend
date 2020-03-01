import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt-config";
import * as UserService from "../services/user";
import {InvalidPasswordError} from "../errors";

function publishToken(user) {
    return new Promise((resolve, reject) => {
        const payload = {username: user.username, isAdmin: user.isAdmin};
        const options = {expiresIn: '7d'};

        jwt.sign(payload, jwtConfig.secret, options, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
}

export function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
}

export function register(username, password, email, isAdmin) {
    const encrypted = UserService.encryptPassword(password);
    return UserService.createUser(username, encrypted, email, isAdmin);
}

export function login(username, password) {
    return UserService.getUser(username)
        .then(user => {
            if (!UserService.verifyPassword(user, password)) throw new InvalidPasswordError();
            return publishToken(user);
        });
}