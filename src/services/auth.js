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

export function loginWithFacebook(code) {
    let url = 'https://graph.facebook.com/v6.0/oauth/access_token?' +
              'client_id=' + process.env.APP_FACEBOOK_API_APP_ID +
              '&redirect_uri=' + process.env.APP_FACEBOOK_API_REDIRECT_URI +
              '&client_secret=' + process.env.APP_FACEBOOK_API_APP_SECRET +
              '&code=' + code;
    return axios.get(url)
        .then(response => {
            let token = response.data.access_token;
            return loginWithFacebookToken(token);
        });
}

function loginWithFacebookToken(token) {
    return axios.get(`https://graph.facebook.com/me?fields=email,name&access_token=${token}`)
        .then(async response => {
            const profile = response.data;

            let username = profile.email;
            let email = profile.email;
            let fullName = profile.name;

            let user;
            try {
                user = await UserService.getUserByName(username, 'facebook');
            } catch (e) {
                if (e instanceof UserNotFoundError) {
                    user = await UserService.createUserWithSns(username, 'facebook', email, fullName, false);
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

export function loginWithGoogle(code) {
    let url = 'https://oauth2.googleapis.com/token?grant_type=authorization_code' +
              '&client_id=' + process.env.APP_GOOGLE_API_CLIENT_ID +
              '&client_secret=' + process.env.APP_GOOGLE_API_CLIENT_SECRET +
              '&redirect_uri=' + process.env.APP_GOOGLE_API_REDIRECT_URI +
              '&code=' + code;
    return axios.post(url)
        .then(response => {
            let token = response.data.access_token;
            return loginWithGoogleToken(token);
        });
}

function loginWithGoogleToken(token) {
    let config = {
        headers: {Authorization: 'Bearer ' + token}
    };
    return axios.get(`https://www.googleapis.com/oauth2/v2/userinfo`, config)
        .then(async response => {
            const profile = response.data;

            let username = profile.email;
            let email = profile.email;
            let fullName = profile.name;

            let user;
            try {
                user = await UserService.getUserByName(username, 'google');
            } catch (e) {
                if (e instanceof UserNotFoundError) {
                    user = await UserService.createUserWithSns(username, 'google', email, fullName, false);
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