import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Food = new Schema({
    name: String,
    calories: Number
});

export default mongoose.model('food', Food);