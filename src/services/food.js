import Food from "../models/food";

export function getFoods() {
    return Food.find();
}

export function getFood(name) {
    return Food.findOne({name});
}

export function createFood(name, calories) {
    return Food.create({name, calories});
}

export function updateFood(name, calories) {
    return Food.findOne({name})
        .then(food => {
            if (!food) return;
            if (calories) food.calories = calories;
            return food.save();
        });
}

export function deleteFood(name) {
    return Food.deleteOne({name});
}