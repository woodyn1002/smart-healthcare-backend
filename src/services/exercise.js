import Exercise from "../models/exercise";

export function getExercises() {
    return Exercise.find();
}

export function getExercise(name) {
    return Exercise.findOne({name});
}

export function createExercise(name, met) {
    return Exercise.create({name, met});
}

export function updateExercise(name, met) {
    return Exercise.findOne({name})
        .then(exercise => {
            if (!exercise) return;
            if (met) exercise.met = met;
            return exercise.save();
        });
}

export function deleteExercise(name) {
    return Exercise.deleteOne({name});
}