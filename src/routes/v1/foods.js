import express from "express";
import validators from "../../middlewares/validators";
import * as FoodService from "../../services/food";
import {FoodExistError, FoodNotFoundError} from "../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof FoodExistError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof FoodNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/',
    (req, res) => {
        FoodService.getFoods()
            .then(foods => res.json(foods))
            .catch(err => respondError(res, err));
    });

router.get('/:name',
    (req, res) => {
        const name = req.params.name;

        FoodService.getFood(name)
            .then(food => res.json(food))
            .catch(err => respondError(res, err));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        const {name, calories} = req.body;

        FoodService.createFood(name, calories)
            .then(food => res.status(201).json(food))
            .catch(err => respondError(res, err));
    });

router.put('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        const name = req.params.name;
        const calories = req.body.calories;

        FoodService.updateFood(name, calories)
            .then(food => res.json(food))
            .catch(err => respondError(res, err));
    });

router.delete('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        const name = req.params.name;

        FoodService.deleteFood(name)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;