import express from "express";
import * as MealService from "../../../services/meal";
import validators from "../../../middlewares/validators";
import {MealExistError, MealNotFoundError} from "../../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof MealExistError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof MealNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/meals',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const username = req.params.username;
        const date = req.query.date;

        MealService.getMeals(username, date)
            .then(meals => res.json(meals))
            .catch(err => respondError(res, err));
    });

router.get('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {username, date} = req.params;

        MealService.getMeal(username, date)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.post('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        MealService.createMeal(username, date, data)
            .then(meal => res.status(201).json(meal))
            .catch(err => respondError(res, err));
    });

router.put('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        MealService.updateMeal(username, date, data)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {username, date} = req.params;

        MealService.deleteMeal(username, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;