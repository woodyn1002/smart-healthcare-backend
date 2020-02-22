import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Fitness = new Schema({
    username: String,
    exerciseId: mongoose.Types.ObjectId,
    date: Date,
    burntCalories: Number,
    count: Number,
    elapsedTime: Number
});

export default mongoose.model('fitness', Fitness);