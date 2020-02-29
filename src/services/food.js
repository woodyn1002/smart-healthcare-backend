import Food from "../models/food";

class FoodService {
    getFoods() {
        return Food.find();
    }

    getFood(name) {
        return Food.findOne({name});
    }

    createFood(name, calories) {
        return Food.create({name, calories});
    }

    updateFood(name, calories) {
        return Food.findOne({name})
            .then(food => {
                if (!food) return;
                if (calories) food.calories = calories;
                return food.save();
            });
    }

    deleteFood(name) {
        return Food.deleteOne({name});
    }
}

export let foodService = new FoodService();