import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fitnessSchema = new Schema({
    username: {type: String, index: true, required: true},
    date: {type: Date, index: true, required: true},
    exerciseId: {type: String, required: true},
    burntCalories: {type: Number, required: true},
    count: {type: Number, required: true},
    elapsedTime: {type: Number, required: true}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Fitness', fitnessSchema, 'fitness');