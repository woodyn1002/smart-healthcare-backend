import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
});

userSchema.statics.findByUsername = function (username) {
    return this.find({username});
};

export default mongoose.model('User', userSchema, 'users');