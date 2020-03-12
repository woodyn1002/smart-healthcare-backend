import Food from "../models/food";
import {FoodExistError, FoodNotFoundError} from "../errors";

export function getFoods() {
    return Food.find();
}

export function getFood(id) {
    return Food.findOne({id})
        .then(food => {
            if (!food) throw new FoodNotFoundError(id);
            return food;
        });
}

export function createFood(id, name, calories) {
    return Food.findOne({id})
        .then(food => {
            if (food) throw new FoodExistError(id);
            return Food.create({id, name, calories});
        });
}

export function updateFood(id, name, calories) {
    return Food.findOne({id})
        .then(food => {
            if (!food) throw new FoodNotFoundError(id);

            food.name = name;
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