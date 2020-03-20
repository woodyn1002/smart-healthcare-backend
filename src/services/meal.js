import Meal from "../models/meal";
import moment from "moment";
import * as FoodService from "./food";
import {FoodNotFoundError, MealExistError, MealNotFoundError} from "../errors";

export function searchMeals(username, options) {
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

    let query = Meal.find(conditions);

    if (options.limit) query = query.limit(options.limit);
    if (options.sortByDates) query = query.sort({date: 1});
    if (options.sortByDatesDesc) query = query.sort({date: -1});

    return query;
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
        .then(async meal => {
            if (meal) throw new MealExistError(username, date);

            let foods = await FoodService.getFoods();
            for (let dish of data.dishes) {
                let food = foods.find(food => food.id === dish.foodId);
                if (!food) throw new FoodNotFoundError(dish.foodId);
            }

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
        .then(async meal => {
            if (!meal) throw new MealNotFoundError(username, date);

            if (data.dishes) {
                let foods = await FoodService.getFoods();
                for (let dish of data.dishes) {
                    let food = foods.find(food => food.id === dish.foodId);
                    if (!food) throw new FoodNotFoundError(dish.foodId);
                }
            }

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