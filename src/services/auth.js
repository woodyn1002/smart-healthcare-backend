import axios from "axios";
import jwt from "jsonwebtoken";
import * as UserService from "../services/user";
import {InvalidPasswordError, UserNotFoundError} from "../errors";

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

export function loginWithNaver(code, state) {
    let url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code' +
              '&client_id=' + process.env.APP_NAVER_API_CLIENT_ID +
              '&client_secret=' + process.env.APP_NAVER_API_CLIENT_SECRET +
              '&code=' + code +
              '&state=' + state;
    return axios.get(url)
        .then(response => {
            let token = response.data.access_token;
            return loginWithNaverToken(token);
        });
}

function loginWithNaverToken(token) {
    let config = {
        headers: {Authorization: 'Bearer ' + token}
    };
    return axios.get('https://openapi.naver.com/v1/nid/me', config)
        .then(async response => {
            if (response.data.resultcode !== '00') throw new Error(response.data.message);

            const profile = response.data.response;

            let username = profile.nickname;
            let email = profile.email;
            let fullName = profile.name;

            let user;
            try {
                user = await UserService.getUserByName(username, 'naver');
            } catch (e) {
                if (e instanceof UserNotFoundError) {
                    user = await UserService.createUserWithSns(username, 'naver', email, fullName, false);
                } else {
                    throw e;
                }
            }
            return user;
        })
        .then(user => {
            return publishToken(user);
        });
}