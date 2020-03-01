import Exercise from "../models/exercise";
import {ExerciseExistError, ExerciseNotFoundError} from "../errors";

export function getExercises() {
    return Exercise.find();
}

export function getExercise(name) {
    return Exercise.findOne({name})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(name);
            return exercise;
        });
}

export function createExercise(name, met) {
    return Exercise.findOne({name})
        .then(exercise => {
            if (exercise) throw new ExerciseExistError(name);
            return Exercise.create({name, met});
        });
}

export function updateExercise(name, met) {
    return Exercise.findOne({name})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(name);

            exercise.met = met;
            return exercise.save();
        });
}

export function deleteExercise(name) {
    return Exercise.findOneAndDelete({name})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(name);
            return exercise;
        });
}