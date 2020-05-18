import Fitness from "../models/fitness";
import moment from "moment";
import * as ExerciseService from "./exercise";
import {ExerciseNotFoundError, FitnessExistError, FitnessNotFoundError} from "../errors";

function toResponseJson(doc) {
    const populated = (doc, exercises) => {
        let fitness = doc.toJSON();
        if (fitness.exerciseId) {
            fitness.exercise = exercises.find(exercise => exercise.id === fitness.exerciseId);
        }
        return fitness;
    };

    return new Promise(async (resolve) => {
        let exercises = await ExerciseService.getExercises();

        if (doc instanceof Array) {
            let fitnessList = [];
            for (let element of doc)
                fitnessList.push(populated(element, exercises));
            return resolve(fitnessList);
        } else {
            return resolve(populated(doc, exercises));
        }
    });
}

export function searchFitness(userId, options) {
    let conditions = {userId};

    if (options.date) {
        let fromDate = moment(options.date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let toDate = moment(fromDate).add(1, 'days');
        conditions.date = {$gte: fromDate, $lt: toDate};
    }
    if (options.fromDate) {
        options.fromDate = moment(options.fromDate);
        if (!conditions.date) conditions.date = {};
        conditions.date.$gte = options.fromDate;
    }
    if (options.toDate) {
        options.toDate = moment(options.toDate);
        if (!conditions.date) conditions.date = {};
        conditions.date.$lt = options.toDate;
    }

    let query = Fitness.find(conditions);

    if (options.limit) query = query.limit(options.limit);
    if (options.sortByDates) query = query.sort({date: 1});
    if (options.sortByDatesDesc) query = query.sort({date: -1});

    return query.then(fitnessList => toResponseJson(fitnessList));
}

export function getFitness(userId, date) {
    return Fitness.findOne({userId, date})
        .then(fitness => {
            if (!fitness) throw new FitnessNotFoundError(userId, date);
            return fitness;
        })
        .then(fitnessList => toResponseJson(fitnessList));
}

async function validateExercise(data) {
    if (data.exerciseId) {
        let exercise = await ExerciseService.getExercise(data.exerciseId);
        if (!exercise) throw new ExerciseNotFoundError(data.exerciseId);
    } else if (data.exercise) {
        if (!data.exercise.name) {
            throw new Error('Field exercise.name must be provided');
        }
    } else {
        throw new Error('Field exerciseId or exercise must be provided');
    }
}

export function createFitness(userId, date, data) {
    return Fitness.findOne({userId, date})
        .then(async fitness => {
            if (fitness) throw new FitnessExistError(userId, date);
            await validateExercise(data);

            const document = {
                userId,
                date,
                burntCalories: data.burntCalories,
                count: data.count,
                elapsedTime: data.elapsedTime,
                intensity: data.intensity
            };
            if (data.exerciseId)
                document.exerciseId = data.exerciseId;
            else
                document.exercise = data.exercise;
            return Fitness.create(document);
        })
        .then(fitnessList => toResponseJson(fitnessList));
}

export function updateFitness(userId, date, data) {
    return Fitness.findOne({userId, date})
        .then(async fitness => {
            if (!fitness) throw new FitnessNotFoundError(userId, date);
            await validateExercise(data);

            if (data.date) {
                let alreadyExists = await exists(userId, data.date);
                if (alreadyExists) throw new FitnessExistError(userId, data.date);
                fitness.date = data.date;
            }
            if (data.exerciseId) fitness.exerciseId = data.exerciseId;
            else if (data.exercise) fitness.exercise = data.exercise;
            if (data.burntCalories) fitness.burntCalories = data.burntCalories;
            if (data.count) fitness.count = data.count;
            if (data.elapsedTime) fitness.elapsedTime = data.elapsedTime;
            if (data.intensity !== undefined) fitness.intensity = data.intensity;

            return fitness.save();
        })
        .then(fitnessList => toResponseJson(fitnessList));
}

export function deleteFitness(userId, date) {
    return Fitness.findOneAndDelete({userId, date})
        .then(fitness => {
            if (!fitness) throw new FitnessNotFoundError(userId, date);
        });
}

export function deleteAllOf(userId) {
    return Fitness.remove({userId});
}

export function exists(userId, date) {
    return Fitness.exists({userId, date});
}