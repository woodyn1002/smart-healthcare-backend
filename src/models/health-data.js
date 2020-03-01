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
    bloodPressure: Number,
    neutralFat: Number,
    hdlCholesterol: Number,
    fastingBloodSugar: Number
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('HealthData', healthDataSchema, 'healthdata');