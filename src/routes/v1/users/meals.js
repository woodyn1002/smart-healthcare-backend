import express from "express";
import Joi from "joi";
import * as MealService from "../../../services/meal";
import validators from "../../../middlewares/validators";
import {MealExistError, MealNotFoundError} from "../../../errors";

const router = express.Router();

const dishSchema = Joi.object().keys({
    foodId: Joi.string().required(),
    amount: Joi.number().positive()
});

const respondError = (res, err) => {
    if (err instanceof MealExistError) {
        res.status(403).json({error: {name: err.name, message: err.message}});
    } else if (err instanceof MealNotFoundError) {
        res.status(404).json({error: {name: err.name, message: err.message}});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/meals',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required()
    }),
    validators.query({
        date: Joi.string().isoDate(),
        options: {
            date: Joi.string(),
            fromDate: Joi.string().isoDate(),
            toDate: Joi.string().isoDate(),
            limit: Joi.number().positive(),
            sortByDates: Joi.boolean(),
            sortByDatesDesc: Joi.boolean()
        }
    }),
    (req, res) => {
        const username = req.params.username;
        const options = req.query;

        MealService.searchMeals(username, options)
            .then(meals => res.json(meals))
            .catch(err => respondError(res, err));
    });

router.get('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {username, date} = req.params;

        MealService.getMeal(username, date)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.post('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        location: Joi.string(),
        satisfactionScore: Joi.number().min(0).max(4),
        dishes: Joi.array().items(dishSchema)
    }),
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        MealService.createMeal(username, date, data)
            .then(meal => res.status(201).json(meal))
            .catch(err => respondError(res, err));
    });

router.put('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        location: Joi.string(),
        satisfactionScore: Joi.number().min(0).max(4),
        dishes: Joi.array().items(dishSchema)
    }),
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        MealService.updateMeal(username, date, data)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {username, date} = req.params;

        MealService.deleteMeal(username, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;