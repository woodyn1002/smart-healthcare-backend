import mongoose from "mongoose";
import Food from "../models/food";

class FoodService {
    getFoods() {
        return Food.find();
    }

    getFood(id) {
        return Food.findOne({_id: mongoose.Types.ObjectId(id)});
    }

    createFood(name, calories) {
        const food = new Food({
            name,
            calories
        });

        return food.save();
    }

    updateFood(id, name, calories) {
        return Food.findOne({_id: mongoose.Types.ObjectId(id)})
            .then(food => {
                if (!food) return;
                if (name) food.name = name;
                if (calories) food.calories = calories;
                return food.save();
            });
    }

    deleteFood(id) {
        return Food.deleteOne({_id: mongoose.Types.ObjectId(id)});
    }
}

export let foodService = new FoodService();