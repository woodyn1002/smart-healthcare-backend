import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    id: {type: String, index: true, unique: true, required: true},
    name: {type: String, required: true},
    calories: {type: Number, required: true}
}, {
    id: false,
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Food', foodSchema, 'foods');