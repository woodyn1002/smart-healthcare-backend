import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Exercise = new Schema({
    name: String,
    met: Number
});

export default mongoose.model('exercise', Exercise);