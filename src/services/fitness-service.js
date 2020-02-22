import mongoose from "mongoose";
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

    getFitness(id) {
        return Fitness.find({_id: mongoose.Types.ObjectId(id)});
    }

    createFitness(username, data) {
        const fitness = new Fitness({
            username,
            exerciseId: mongoose.Types.ObjectId(data.exerciseId),
            date: data.date,
            burntCalories: data.burntCalories,
            count: data.count,
            elapsedTime: data.elapsedTime
        });

        return fitness.save();
    }

    updateFitness(id, data) {
        return Fitness.findOne({_id: mongoose.Types.ObjectId(id)})
            .then(fitness => {
                if (!fitness) return;

                if (data.exerciseId) fitness.exerciseId = data.exerciseId;
                if (data.date) fitness.date = data.date;
                if (data.burntCalories) fitness.burntCalories = data.burntCalories;
                if (data.count) fitness.count = data.count;
                if (data.elapsedTime) fitness.elapsedTime = data.elapsedTime;

                return fitness.save();
            });
    }

    deleteFitness(id) {
        return Fitness.deleteOne({_id: mongoose.Types.ObjectId(id)});
    }
}

export let fitnessService = new FitnessService();