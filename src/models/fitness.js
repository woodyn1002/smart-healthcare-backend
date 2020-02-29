import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Fitness = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    date: {type: Date, index: true, required: true},
    exerciseId: {type: mongoose.Types.ObjectId, required: true},
    burntCalories: {type: Number, required: true},
    count: {type: Number, required: true},
    elapsedTime: {type: Number, required: true}
});

export default mongoose.model('fitness', Fitness);