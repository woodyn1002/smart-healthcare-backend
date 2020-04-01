import mongoose from "mongoose";
import * as MUUID from "uuid-mongodb";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: 'object',
        value: {type: 'Buffer'},
        default: () => MUUID.v1()
    },
    username: {type: String, index: true, required: true},
    sns: {type: String, index: true},
    password: {type: String},
    email: {type: String, required: true},
    fullName: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
}, {
    id: false,
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    }
});

userSchema.virtual('id')
    .get(function () {
        return MUUID.from(this._id).toString();
    })
    .set(function (val) {
        this._id = MUUID.from(val);
    });

userSchema.statics.findByStringId = function (userId) {
    return this.findOne({userId: MUUID.from(userId)});
};

export default mongoose.model('User', userSchema, 'users');