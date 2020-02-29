import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Food = new Schema({
    name: {type: String, index: true, unique: true, required: true},
    calories: {type: Number, required: true}
});

export default mongoose.model('food', Food);