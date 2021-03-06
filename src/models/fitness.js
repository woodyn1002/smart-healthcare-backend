import mongoose from "mongoose";

const Schema = mongoose.Schema;

const fitnessSchema = new Schema({
    userId: {type: String, index: true, required: true},
    date: {type: Date, index: true, required: true},
    exerciseId: String,
    exercise: {
        name: String,
        met: Number
    },
    burntCalories: {type: Number, required: true},
    count: {type: Number, required: true},
    elapsedTime: {type: Number, required: true},
    intensity: {type: Number, min: 0, max: 4}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Fitness', fitnessSchema, 'fitness');