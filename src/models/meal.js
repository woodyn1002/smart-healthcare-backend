import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dishSchema = new Schema({
    foodName: {type: String, required: true},
    amount: {type: Number, default: 1}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

const mealSchema = new Schema({
    username: {type: String, index: true, unique: true, required: true},
    date: {type: Date, index: true, required: true},
    location: String,
    satisfactionScore: {type: Number, min: 0, max: 4},
    dishes: [dishSchema]
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export default mongoose.model('Meal', mealSchema, 'meals');