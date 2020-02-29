import mongoose from "mongoose";

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: {type: String, index: true, unique: true, required: true},
    calories: {type: Number, required: true}
});

export default mongoose.model('Food', foodSchema, 'foods');