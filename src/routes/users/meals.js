import express from "express";
import "moment-timezone";
import {mealService} from "../../services/meal";
import validators from "../../middlewares/validators";

const router = express.Router();

router.get('/:username/meals',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        mealService.getMeals(req.params.username, req.query.date)
            .then(meals => {
                res.json(meals);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.get('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        mealService.getMeal(req.params.username, req.params.date)
            .then(meal => {
                if (!meal) return res.status(404).json({error: 'meal not found'});

                res.json(meal);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.post('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        mealService.createMeal(req.params.username, req.params.date, req.body)
            .then(meal => {
                res.json(meal);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.put('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        mealService.updateMeal(req.params.username, req.params.date, req.body)
            .then(meal => {
                if (!meal) return res.status(404).json({error: 'meal not found'});
                res.json(meal);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.delete('/:username/meals/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        mealService.getMeal(req.params.username, req.params.date)
            .then(meal => {
                if (!meal) return res.status(404).json({error: 'meal not found'});
                return mealService.deleteMeal(req.params.username, req.params.date);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    });

export default router;