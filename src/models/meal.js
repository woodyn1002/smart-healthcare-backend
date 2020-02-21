import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Meal = new Schema({
    username: String,
    date: Date,
    location: String,
    satisfactionScore: Number,
    foods: Array
});

export default mongoose.model('meal', Meal);