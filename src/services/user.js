import * as MUUID from "uuid-mongodb";
import crypto from "crypto";
import User from "../models/user";
import {UsernameExistError, UserNotFoundError} from "../errors";
import * as HealthDataService from "./health-data";
import * as MealService from "./meal";
import * as FitnessService from "./fitness";

export function encryptPassword(password) {
    return crypto.createHmac('sha1', process.env.APP_PWD_SECRET)
        .update(password)
        .digest('base64');
}

export function getUsers() {
    return User.find();
}

export function getUser(userId) {
    return User.findOne({_id: MUUID.from(userId)})
        .then(user => {
            if (!user) throw new UserNotFoundError(userId);
            return user;
        });
}

export function getUserByName(username, sns) {
    return User.findOne({username, sns})
        .then(user => {
            if (!user) throw new UserNotFoundError(username);
            return user;
        });
}

export function createUser(username, password, email, fullName, isAdmin) {
    return User.findOne({username, sns: null})
        .then(user => {
            if (user) throw new UsernameExistError(username);

            return User.create({username, sns: null, password, email, fullName, isAdmin});
        });
}

export function createUserWithSns(username, sns, email, fullName, isAdmin) {
    return User.findOne({username, sns})
        .then(user => {
            if (user) throw new UsernameExistError(username);

            return User.create({username, sns, email, fullName, isAdmin});
        });
}

export function updateUser(userId, password, email, fullName, isAdmin) {
    return User.findOne({_id: MUUID.from(userId)})
        .then(user => {
            if (!user) throw new UserNotFoundError(userId);

            if (password) user.password = encryptPassword(password);
            if (email) user.email = email;
            if (fullName) user.fullName = fullName;
            if (isAdmin) user.isAdmin = isAdmin;

            return user.save();
        });
}

export function deleteUser(userId) {
    return User.findOneAndDelete({_id: MUUID.from(userId)})
        .then(user => {
            if (!user) throw new UserNotFoundError(userId);

            let promises = [];

            promises.push(HealthDataService.deleteAllOf(userId));
            promises.push(MealService.deleteAllOf(userId));
            promises.push(FitnessService.deleteAllOf(userId));

            return Promise.all(promises);
        });
}

export function verifyPassword(user, password) {
    return user.password === encryptPassword(password);
}