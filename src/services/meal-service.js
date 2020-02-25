import mongoose from "mongoose";
import Meal from "../models/meal";
import moment from "moment";

class MealService {
    getMeals(username, date) {
        let conditions = {username};

        if (date !== undefined) {
            let gteDate = moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            let ltDate = moment(gteDate).add(1, 'days');
            conditions.date = {$gte: gteDate, $lt: ltDate};
        }

        return Meal.find(conditions);
    }

    getMeal(id) {
        return Meal.findOne({_id: mongoose.Types.ObjectId(id)});
    }

    createMeal(username, data) {
        const meal = new Meal({
            username,
            date: data.date,
            location: data.location,
            satisfactionScore: data.satisfactionScore,
            foods: data.foods
        });

        return meal.save();
    }

    updateMeal(id, data) {
        return Meal.findOne({_id: mongoose.Types.ObjectId(id)})
            .then(meal => {
                if (!meal) return;

                if (data.date) meal.date = data.date;
                if (data.location) meal.location = data.location;
                if (data.satisfactionScore) meal.satisfactionScore = data.satisfactionScore;
                if (data.foods) meal.foods = data.foods;

                return meal.save();
            });
    }

    deleteMeal(id) {
        return Meal.deleteOne({_id: mongoose.Types.ObjectId(id)});
    }
}

export let mealService = new MealService();