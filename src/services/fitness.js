import Fitness from "../models/fitness";
import moment from "moment";
import * as ExerciseService from "./exercise";
import {ExerciseNotFoundError, FitnessExistError, FitnessNotFoundError} from "../errors";

export function searchFitness(username, options) {
    let conditions = {username};

    if (options.date) {
        let fromDate = moment(options.date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let toDate = moment(fromDate).add(1, 'days');
        conditions.date = {$gte: fromDate, $lt: toDate};
    }
    if (options.fromDate) {
        options.fromDate = moment(options.fromDate).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        options.toDate = moment(options.fromDate).add(1, 'days');
        conditions.date = {$gte: options.fromDate, $lt: options.toDate};
    }

    let query = Fitness.find(conditions);

    if (options.limit) query = query.limit(options.limit);
    if (options.sortByDates) query = query.sort({date: 1});
    if (options.sortByDatesDesc) query = query.sort({date: -1});

    return query;
}

export function getFitness(username, date) {
    return Fitness.findOne({username, date})
        .then(fitness => {
            if (!fitness) throw new FitnessNotFoundError(username, date);
            return fitness;
        })
}

export function createFitness(username, date, data) {
    return Fitness.findOne({username, date})
        .then(async fitness => {
            if (fitness) throw new FitnessExistError(username, date);

            let exercise = await ExerciseService.getExercise(data.exerciseId);
            if (!exercise) throw new ExerciseNotFoundError(data.exerciseId);

            return Fitness.create({
                username,
                date,
                exerciseId: data.exerciseId,
                burntCalories: data.burntCalories,
                count: data.count,
                elapsedTime: data.elapsedTime,
                intensity: data.intensity
            });
        });
}

export function updateFitness(username, date, data) {
    return Fitness.findOne({username, date})
        .then(async fitness => {
            if (!fitness) throw new FitnessNotFoundError(username, date);

            let exercise = await ExerciseService.getExercise(data.exerciseId);
            if (!exercise) throw new ExerciseNotFoundError(data.exerciseId);

            if (data.exerciseId) fitness.exerciseId = data.exerciseId;
            if (data.burntCalories) fitness.burntCalories = data.burntCalories;
            if (data.count) fitness.count = data.count;
            if (data.elapsedTime) fitness.elapsedTime = data.elapsedTime;
            if (data.intensity) fitness.intensity = data.intensity;

            return fitness.save();
        });
}

export function deleteFitness(username, date) {
    return Fitness.findOneAndDelete({username, date})
        .then(fitness => {
            if (!fitness) throw new FitnessNotFoundError(username, date);
        });
}