import jwt from "jsonwebtoken";
import * as UserService from "../services/user";
import {InvalidPasswordError} from "../errors";

const jwtSecret = process.env.APP_JWT_SECRET;

function publishToken(user) {
    return new Promise((resolve, reject) => {
        const payload = {userId: user.id, isAdmin: user.isAdmin};
        const options = {expiresIn: '7d'};

        jwt.sign(payload, jwtSecret, options, (err, token) => {
            if (err) reject(err);
            resolve({user, token});
        });
    });
}

export function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
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
    return UserService.getUserByName(username, null)
        .then(user => {
            if (!UserService.verifyPassword(user, password)) throw new InvalidPasswordError();
            return publishToken(user);
        });
}