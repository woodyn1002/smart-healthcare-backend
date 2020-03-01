import Food from "../models/food";
import {FoodExistError, FoodNotFoundError} from "../errors";

export function getFoods() {
    return Food.find();
}

export function getFood(name) {
    return Food.findOne({name})
        .then(food => {
            if (!food) throw new FoodNotFoundError(name);
            return food;
        });
}

export function createFood(name, calories) {
    return Food.findOne({name})
        .then(food => {
            if (food) throw new FoodExistError(name);
            return Food.create({name, calories});
        });
}

export function updateFood(name, calories) {
    return Food.findOne({name})
        .then(food => {
            if (!food) throw new FoodNotFoundError(name);

            food.calories = calories;
            return food.save();
        });
}

export function deleteFood(name) {
    return Food.findOneAndDelete({name})
        .then(food => {
            if (!food) throw new FoodNotFoundError(name);
        });
}