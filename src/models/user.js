import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
});

User.statics.findByUsername = function (username) {
    return this.find({username});
};

export default mongoose.model('User', User, 'users');