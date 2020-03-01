import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: {type: String, index: true, unique: true, required: true},
    calories: {type: Number, required: true}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Food', foodSchema, 'foods');