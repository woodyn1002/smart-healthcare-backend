import Meal from "../models/meal";
import moment from "moment";

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
    return Meal.findOne({username, date});
}

export function createMeal(username, date, data) {
    return Meal.create({
        username,
        date,
        location: data.location,
        satisfactionScore: data.satisfactionScore,
        foods: data.foods
    });
}

export function updateMeal(username, date, data) {
    return Meal.findOne({username, date})
        .then(meal => {
            if (!meal) return;

            if (data.location) meal.location = data.location;
            if (data.satisfactionScore) meal.satisfactionScore = data.satisfactionScore;
            if (data.foods) meal.foods = data.foods;

            return meal.save();
        });
}

export function deleteMeal(username, date) {
    return Meal.deleteOne({username, date});
}