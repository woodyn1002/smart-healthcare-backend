import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    password: String,
    isAdmin: {Type: Boolean, "default": false}
});

export default mongoose.model('user', User);