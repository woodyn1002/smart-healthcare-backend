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

    getMeal(username, date) {
        return Meal.findOne({username, date});
    }

    createMeal(username, date, data) {
        return Meal.create({
            username,
            date,
            location: data.location,
            satisfactionScore: data.satisfactionScore,
            foods: data.foods
        });
    }

    updateMeal(username, date, data) {
        return Meal.findOne({username, date})
            .then(meal => {
                if (!meal) return;

                if (data.location) meal.location = data.location;
                if (data.satisfactionScore) meal.satisfactionScore = data.satisfactionScore;
                if (data.foods) meal.foods = data.foods;

                return meal.save();
            });
    }

    deleteMeal(username, date) {
        return Meal.deleteOne({username, date});
    }
}

export let mealService = new MealService();