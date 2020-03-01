import Meal from "../models/meal";
import moment from "moment";
import {MealExistError, MealNotFoundError} from "../errors";

export function getMeals(username, date) {
    let conditions = {username};

    if (date !== undefined) {
        let gteDate = moment(date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let ltDate = moment(gteDate).add(1, 'days');
        conditions.date = {$gte: gteDate, $lt: ltDate};
    }

    return Meal.find(conditions);
}

export function getMeal(username, date) {
    return Meal.findOne({username, date})
        .then(meal => {
            if (!meal) throw new MealNotFoundError(username, date);
            return meal;
        });
}

export function createMeal(username, date, data) {
    return Meal.findOne({username, date})
        .then(meal => {
            if (meal) throw new MealExistError(username, date);
            return Meal.create({
                username,
                date,
                location: data.location,
                satisfactionScore: data.satisfactionScore,
                dishes: data.dishes
            });
        });
}

export function updateMeal(username, date, data) {
    return Meal.findOne({username, date})
        .then(meal => {
            if (!meal) throw new MealNotFoundError(username, date);

            if (data.location) meal.location = data.location;
            if (data.satisfactionScore) meal.satisfactionScore = data.satisfactionScore;
            if (data.dishes) meal.dishes = data.dishes;

            return meal.save();
        });
}

export function deleteMeal(username, date) {
    return Meal.findOneAndDelete({username, date})
        .then(meal => {
            if (!meal) throw new MealNotFoundError(username, date);
        });
}