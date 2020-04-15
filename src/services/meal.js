import Meal from "../models/meal";
import moment from "moment";
import * as FoodService from "./food";
import {FoodNotFoundError, MealExistError, MealNotFoundError} from "../errors";

function toResponseJson(doc) {
    const populated = (doc, foods) => {
        let meal = doc.toJSON();
        meal.totalCalories = 0;

        for (let dish of meal.dishes) {
            let food = foods.find(food => food.id === dish.foodId);
            if (food) {
                dish.food = food;
                meal.totalCalories += food.calories * dish.amount;
            }
        }
        return meal;
    };

    return new Promise(async (resolve) => {
        let foods = await FoodService.getFoods();

        if (doc instanceof Array) {
            let meals = [];
            for (let element of doc)
                meals.push(populated(element, foods));
            return resolve(meals);
        } else {
            return resolve(populated(doc, foods));
        }
    });
}

export function searchMeals(userId, options) {
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

    let query = Meal.find(conditions);

    if (options.limit) query = query.limit(options.limit);
    if (options.sortByDates) query = query.sort({date: 1});
    if (options.sortByDatesDesc) query = query.sort({date: -1});

    return query.then(meals => toResponseJson(meals));
}

export function getMeal(userId, date) {
    return Meal.findOne({userId, date})
        .then(meal => {
            if (!meal) throw new MealNotFoundError(userId, date);
            return meal;
        })
        .then(meal => toResponseJson(meal));
}

export function createMeal(userId, date, data) {
    return Meal.findOne({userId, date})
        .then(async meal => {
            if (meal) throw new MealExistError(userId, date);

            let foods = await FoodService.getFoods();
            for (let dish of data.dishes) {
                let food = foods.find(food => food.id === dish.foodId);
                if (!food) throw new FoodNotFoundError(dish.foodId);
            }

            return Meal.create({
                userId,
                date,
                location: data.location,
                satisfactionScore: data.satisfactionScore,
                dishes: data.dishes
            });
        })
        .then(meal => toResponseJson(meal));
}

export function updateMeal(userId, date, data) {
    return Meal.findOne({userId, date})
        .then(async meal => {
            if (!meal) throw new MealNotFoundError(userId, date);

            if (data.dishes) {
                let foods = await FoodService.getFoods();
                for (let dish of data.dishes) {
                    let food = foods.find(food => food.id === dish.foodId);
                    if (!food) throw new FoodNotFoundError(dish.foodId);
                }
            }

            if (data.date) {
                let alreadyExists = await exists(userId, data.date);
                if (alreadyExists) throw new MealExistError(userId, data.date);
                meal.date = data.date;
            }
            if (data.location) meal.location = data.location;
            if (data.satisfactionScore) meal.satisfactionScore = data.satisfactionScore;
            if (data.dishes) meal.dishes = data.dishes;

            return meal.save();
        })
        .then(async meal => toResponseJson(meal));
}

export function deleteMeal(userId, date) {
    return Meal.findOneAndDelete({userId, date})
        .then(meal => {
            if (!meal) throw new MealNotFoundError(userId, date);
        });
}

export function deleteAllOf(userId) {
    return Meal.remove({userId});
}

export function exists(userId, date) {
    return Meal.exists({userId, date});
}