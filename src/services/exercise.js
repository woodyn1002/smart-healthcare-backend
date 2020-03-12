import Exercise from "../models/exercise";
import {ExerciseExistError, ExerciseNotFoundError} from "../errors";

export function getExercises() {
    return Exercise.find();
}

export function getExercise(id) {
    return Exercise.findOne({id})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(id);
            return exercise;
        });
}

export function createExercise(id, met) {
    return Exercise.findOne({id})
        .then(exercise => {
            if (exercise) throw new ExerciseExistError(id);
            return Exercise.create({id, met});
        });
}

export function updateExercise(id, met) {
    return Exercise.findOne({id})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(id);

            exercise.met = met;
            return exercise.save();
        });
}

export function deleteExercise(id) {
    return Exercise.findOneAndDelete({id})
        .then(exercise => {
            if (!exercise) throw new ExerciseNotFoundError(id);
            return exercise;
        });
}