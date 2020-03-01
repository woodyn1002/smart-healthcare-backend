import mongoose from "mongoose";

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    name: {type: String, index: true, unique: true, required: true},
    met: {type: String, required: true}
});

export default mongoose.model('Exercise', exerciseSchema, 'exercises');