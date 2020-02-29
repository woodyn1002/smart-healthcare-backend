import Fitness from "../models/fitness";
import moment from "moment";

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
    return Fitness.findOne({username, date});
}

export function createFitness(username, date, data) {
    return Fitness.create({
        username,
        date,
        exerciseName: data.exerciseName,
        burntCalories: data.burntCalories,
        count: data.count,
        elapsedTime: data.elapsedTime
    });
}

export function updateFitness(username, date, data) {
    return Fitness.findOne({username, date})
        .then(fitness => {
            if (!fitness) return;

            if (data.exerciseName) fitness.exerciseName = data.exerciseName;
            if (data.burntCalories) fitness.burntCalories = data.burntCalories;
            if (data.count) fitness.count = data.count;
            if (data.elapsedTime) fitness.elapsedTime = data.elapsedTime;

            return fitness.save();
        });
}

export function deleteFitness(username, date) {
    return Fitness.deleteOne({username, date});
}