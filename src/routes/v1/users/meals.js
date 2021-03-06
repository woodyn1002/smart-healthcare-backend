import express from "express";
import Joi from "joi";
import * as MealService from "../../../services/meal";
import validators from "../../../middlewares/validators";
import {FoodNotFoundError, MealExistError, MealNotFoundError} from "../../../errors";

const router = express.Router();

const dishSchema = Joi.object().keys({
    foodId: Joi.string(),
    food: {
        name: Joi.string(),
        calories: Joi.number().positive()
    },
    amount: Joi.number().positive()
});

const respondError = (res, err) => {
    if (err instanceof MealExistError) {
        res.status(403).json({error: {name: err.name, message: err.message}});
    } else if (err instanceof MealNotFoundError || err instanceof FoodNotFoundError) {
        res.status(404).json({error: {name: err.name, message: err.message}});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:userId/meals',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required()
    }),
    validators.query({
        date: Joi.string().isoDate(),
        fromDate: Joi.string().isoDate(),
        toDate: Joi.string().isoDate(),
        limit: Joi.number().positive(),
        sortByDates: Joi.boolean(),
        sortByDatesDesc: Joi.boolean()
    }),
    (req, res) => {
        const userId = req.params.userId;
        const options = req.query;

        if (options.limit) options.limit = Number(options.limit);
        if (options.sortByDates) options.sortByDates = Boolean(options.sortByDates);
        if (options.sortByDatesDesc) options.sortByDatesDesc = Boolean(options.sortByDatesDesc);

        MealService.searchMeals(userId, options)
            .then(meals => res.json(meals))
            .catch(err => respondError(res, err));
    });

router.get('/:userId/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        MealService.getMeal(userId, date)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

const dishValidator = (req, res, next) => {
    let dishes = req.body.dishes;
    for (let dish of dishes) {
        if (!dish.foodId && !dish.food)
            return res.status(403).json({
                error: {name: 'ValidationError', message: 'Field foodId or food must be provided'}
            });
        if (dish.food && (!dish.food.name || !dish.food.calories))
            return res.status(403).json({
                error: {name: 'ValidationError', message: 'Fields food.name and food.calories must be provided'}
            });
    }
    next();
};

router.post('/:userId/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        location: Joi.string(),
        satisfactionScore: Joi.number().min(0).max(4),
        dishes: Joi.array().items(dishSchema).required()
    }),
    dishValidator,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        MealService.createMeal(userId, date, data)
            .then(meal => res.status(201).json(meal))
            .catch(err => respondError(res, err));
    });

router.put('/:userId/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        date: Joi.string().isoDate(),
        location: Joi.string(),
        satisfactionScore: Joi.number().min(0).max(4),
        dishes: Joi.array().items(dishSchema).required()
    }),
    dishValidator,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        MealService.updateMeal(userId, date, data)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.delete('/:userId/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        MealService.deleteMeal(userId, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;