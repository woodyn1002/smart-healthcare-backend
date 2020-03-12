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

export function createFood(id, calories) {
    return Food.findOne({id})
        .then(food => {
            if (food) throw new FoodExistError(id);
            return Food.create({id, calories});
        });
}

export function updateFood(id, calories) {
    return Food.findOne({id})
        .then(food => {
            if (!food) throw new FoodNotFoundError(id);

            food.calories = calories;
            return food.save();
        });
}

export function deleteFood(id) {
    return Food.findOneAndDelete({id})
        .then(food => {
            if (!food) throw new FoodNotFoundError(id);
        });
}