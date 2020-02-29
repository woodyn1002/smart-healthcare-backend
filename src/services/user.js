import crypto from "crypto";
import mongodbConfig from "../config/mongodb-config";
import User from "../models/user";

const encryptPassword = function (password) {
    return crypto.createHmac('sha1', mongodbConfig.pwdSecret)
        .update(password)
        .digest('base64');
};

export function createUser(username, password, email, isAdmin) {
    return User.create({username, password, email, isAdmin});
}

export function getUser(username) {
    return User.findByUsername(username);
}

export function changePassword(username, newPassword) {
    return User.findByUsername(username)
        .then(user => {
            if (!user) return;
            user.password = encryptPassword(newPassword);
            return user.save();
        });
}

export function deleteUser(username) {
    return User.deleteOne({username});
}

export function verifyPassword(user, password) {
    return user.password === encryptPassword(password);
}