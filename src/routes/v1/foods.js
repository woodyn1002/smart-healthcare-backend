import express from "express";
import validators from "../../middlewares/validators";
import * as FoodService from "../../services/food";
import {FoodExistError, FoodNotFoundError} from "../../errors";
import Joi from "joi";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof FoodExistError) {
        res.status(403).json({error: {name: err.name, message: err.message}});
    } else if (err instanceof FoodNotFoundError) {
        res.status(404).json({error: {name: err.name, message: err.message}});
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

router.get('/:foodId',
    validators.params({
        foodId: Joi.string().required()
    }),
    (req, res) => {
        const id = req.params.foodId;

        FoodService.getFood(id)
            .then(food => res.json(food))
            .catch(err => respondError(res, err));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    validators.body({
        id: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().positive().required()
    }),
    (req, res) => {
        const {id, name, calories} = req.body;

        FoodService.createFood(id, name, calories)
            .then(food => res.status(201).json(food))
            .catch(err => respondError(res, err));
    });

router.put('/:foodId',
    validators.loggedIn, validators.isAdmin,
    validators.params({
        foodId: Joi.string().required()
    }),
    validators.body({
        name: Joi.string(),
        calories: Joi.number().positive()
    }),
    (req, res) => {
        const id = req.params.foodId;
        const {name, calories} = req.body;

        FoodService.updateFood(id, name, calories)
            .then(food => res.json(food))
            .catch(err => respondError(res, err));
    });

router.delete('/:foodId',
    validators.loggedIn, validators.isAdmin,
    validators.params({
        foodId: Joi.string().required()
    }),
    (req, res) => {
        const id = req.params.foodId;

        FoodService.deleteFood(id)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;