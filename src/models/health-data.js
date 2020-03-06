import mongoose from "mongoose";

const Schema = mongoose.Schema;

const healthDataSchema = new Schema({
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
    bloodPressure: {
        min: Number,
        max: Number,
        medicine: Boolean
    },
    neutralFat: {
        fatigue: Number,
        medicine: Boolean
    },
    hdlCholesterol: Number,
    fastingBloodSugar: {
        fatigue: Number,
        medicine: Boolean
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('HealthData', healthDataSchema, 'healthdata');