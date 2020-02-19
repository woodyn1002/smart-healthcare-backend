import crypto from "crypto";
import mongodbConfig from "../config/mongodb-config";
import User from "../models/user";

let encryptPassword = function (password) {
    return crypto.createHmac('sha1', mongodbConfig.pwdSecret)
        .update(password)
        .digest('base64');
};

class UserService {
    createUser(username, password) {
        const user = new User({
            username,
            password: encryptPassword(password)
        });

        return user.save();
    }

    getUser(username) {
        return User.findOne({username});
    }

    changePassword(username, newPassword) {
        return User.findOne({username})
            .then(user => {
                if (!user) return;
                user.password = encryptPassword(newPassword);
                return user.save();
            });
    }

    deleteUser(username) {
        return User.deleteOne({username});
    }

    verifyPassword(user, password) {
        return user.password === encryptPassword(password);
    }
}

export let userService = new UserService();