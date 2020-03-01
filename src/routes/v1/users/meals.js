import express from "express";
import * as MealService from "../../../services/meal";
import validators from "../../../middlewares/validators";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof MealNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else if (err instanceof MealExistError) {
        res.status(409).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/meals',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        MealService.getMeals(req.params.username, req.query.date)
            .then(meals => res.json(meals))
            .catch(err => respondError(res, err));
    });

router.get('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        MealService.getMeal(req.params.username, req.params.date)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.post('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        MealService.createMeal(req.params.username, req.params.date, req.body)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.put('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        MealService.updateMeal(req.params.username, req.params.date, req.body)
            .then(meal => res.json(meal))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        MealService.deleteMeal(req.params.username, req.params.date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;