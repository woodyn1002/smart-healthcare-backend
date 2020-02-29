import Fitness from "../models/fitness";
import moment from "moment";

class FitnessService {
    getFitnessList(username, date) {
        let conditions = {username};

        if (date !== undefined) {
            let gteDate = moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            let ltDate = moment(gteDate).add(1, 'days');
            conditions.date = {$gte: gteDate, $lt: ltDate};
        }

        return Fitness.find(conditions);
    }

    getFitness(username, date) {
        return Fitness.findOne({username, date});
    }

    createFitness(username, date, data) {
        const fitness = new Fitness({
            username,
            date,
            exerciseName: data.exerciseName,
            burntCalories: data.burntCalories,
            count: data.count,
            elapsedTime: data.elapsedTime
        });

        return fitness.save();
    }

    updateFitness(username, date, data) {
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

    deleteFitness(username, date) {
        return Fitness.deleteOne({username, date});
    }
}

export let fitnessService = new FitnessService();