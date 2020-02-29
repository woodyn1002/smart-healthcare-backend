import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fitnessSchema = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    date: {type: Date, index: true, required: true},
    exerciseName: {type: String, required: true},
    burntCalories: {type: Number, required: true},
    count: {type: Number, required: true},
    elapsedTime: {type: Number, required: true}
});

export default mongoose.model('Fitness', fitnessSchema, 'fitness');