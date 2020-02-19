import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt-config";
import {userService} from "../services/user-service";

class AuthService {
    verify(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtConfig.secret, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });
    }

    register(username, password) {
        const create = (user) => {
            if (user) {
                throw new Error('username exists');
            } else {
                return userService.createUser(username, password);
            }
        };

        return userService.getUser(username)
            .then(create);
    }

    login(username, password) {
        const check = (user) => {
            if (!user) {
                throw new Error('login failed: user not found');
            } else {
                if (userService.verifyPassword(user, password)) {
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

        return userService.getUser(username)
            .then(check);
    }
}

export let authService = new AuthService();