import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

userSchema.statics.findByUsername = function (username) {
    return this.findOne({username});
};

export default mongoose.model('User', userSchema, 'users');