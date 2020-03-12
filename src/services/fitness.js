import Fitness from "../models/fitness";
import moment from "moment";
import {FitnessExistError, FitnessNotFoundError} from "../errors";

export function getFitnessList(username, date) {
    let conditions = {username};

    if (date !== undefined) {
        let gteDate = moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let ltDate = moment(gteDate).add(1, 'days');
        conditions.date = {$gte: gteDate, $lt: ltDate};
    }

    return Fitness.find(conditions);
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
        .then(fitness => {
            if (fitness) throw new FitnessExistError(username, date);

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
        .then(fitness => {
            if (!fitness) throw new FitnessNotFoundError(username, date);

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