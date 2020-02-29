import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
});

export default mongoose.model('User', User, 'users');