import crypto from "crypto";
import mongodbConfig from "../config/mongodb-config";
import User from "../models/user";
import {UsernameExistError, UserNotFoundError} from "../errors";

export function encryptPassword(password) {
    return crypto.createHmac('sha1', mongodbConfig.pwdSecret)
        .update(password)
        .digest('base64');
}

export function getUsers() {
    return User.find();
}

export function getUser(username) {
    return User.findByUsername(username)
        .then(user => {
            if (!user) throw new UserNotFoundError(username);
            return user;
        });
}

export function createUser(username, password, email, fullName, isAdmin) {
    return User.findByUsername(username)
        .then(user => {
            if (user) throw new UsernameExistError(username);

            return User.create({username, password, email, fullName, isAdmin});
        });
}

export function changePassword(username, newPassword) {
    return User.findByUsername(username)
        .then(user => {
            if (!user) throw new UserNotFoundError(username);

            user.password = encryptPassword(newPassword);
            return user.save();
        });
}

export function deleteUser(username) {
    return User.findOneAndDelete({username})
        .then(user => {
            if (!user) throw new UserNotFoundError(username);
        });
}

export function verifyPassword(user, password) {
    return user.password === encryptPassword(password);
}