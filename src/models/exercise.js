import mongoose from "mongoose";

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    id: {type: String, index: true, unique: true, required: true},
    met: {type: Number, required: true}
}, {
    id: false,
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Exercise', exerciseSchema, 'exercises');