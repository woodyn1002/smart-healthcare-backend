import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HealthData = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    sex: {type: String, enum: ['male', 'female']},
    height: Number,
    weight: Number,
    birthdate: {
        date: Date,
        isLunar: Boolean
    },
    ldlCholesterol: Number,
    waist: Number,
    bloodPressure: Number,
    neutralFat: Number,
    hdlCholesterol: Number,
    fastingBloodSugar: Number
});

export default mongoose.model('health-data', HealthData);