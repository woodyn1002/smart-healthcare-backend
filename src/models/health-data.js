import mongoose from "mongoose";
import moment from "moment";

const Schema = mongoose.Schema;

const healthDataSchema = new Schema({
    userId: {type: String, index: true, unique: true, required: true},
    date: {type: Date, index: true, required: true},
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
        max: Number
    },
    bloodPressureMedicine: Boolean,
    neutralFat: Number,
    neutralFatMedicine: Boolean,
    hdlCholesterol: Number,
    fastingBloodSugar: Number,
    fastingBloodSugarMedicine: Boolean
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    }
});

healthDataSchema.virtual('age').get(function () {
    if (this.birthdate && this.birthdate.date) {
        return moment().year() - moment(this.birthdate.date).year() + 1;
    }
    return undefined;
});

healthDataSchema.virtual('bmr').get(function () {
    if (this.age && this.weight && this.height && this.sex) {
        if (this.sex === 'male')
            return 66.47 + (13.75 * this.weight) + (5 * this.height) - (6.76 * this.age);
        else if (this.sex === 'female')
            return 65.51 + (9.56 * this.weight) + (1.85 * this.height) - (4.68 * this.age);
    }
    return undefined;
});

healthDataSchema.virtual('bmi').get(function () {
    if (this.weight && this.height) {
        let heightInMeters = this.height / 100;
        let bmi = this.weight / (heightInMeters * heightInMeters);
        return Math.floor(bmi * 100) / 100;
    }
    return undefined;
});

healthDataSchema.virtual('bmiState').get(function () {
    if (this.bmi === undefined) return undefined;
    else if (this.bmi < 18.5) return 'underweight';
    else if (this.bmi < 23) return 'normal';
    else if (this.bmi < 25) return 'overweight';
    else if (this.bmi < 30) return 'obese';
    else return 'extremelyObese';
});

healthDataSchema.virtual('abnormalFields').get(function () {
    let fields = [];

    if (this.waist &&
        ((this.sex === 'male' && this.waist >= 90) ||
         (this.sex === 'female' && this.waist >= 85))) {
        fields.push('waist');
    }
    if (this.bloodPressure &&
        (this.bloodPressure.min >= 85 || this.bloodPressure.max >= 130)) {
        fields.push('bloodPressure');
    }
    if (this.neutralFat && this.neutralFat >= 150) {
        fields.push('neutralFat');
    }
    if (this.hdlCholesterol &&
        ((this.sex === 'male' && this.hdlCholesterol < 40) ||
         (this.sex === 'female' && this.hdlCholesterol < 50))) {
        fields.push('hdlCholesterol');
    }
    if (this.fastingBloodSugar && this.fastingBloodSugar >= 100) {
        fields.push('fastingBloodSugar');
    }

    return fields;
});

export default mongoose.model('HealthData', healthDataSchema, 'healthdata');