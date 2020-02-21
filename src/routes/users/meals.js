import express from "express";
import moment from "moment";
import "moment-timezone";
import {mealService} from "../../services/meal-service";
import {checkPermission} from "../../check-permission";
import appConfig from "../../config/app-config";

const router = express.Router();

router.get('/', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    mealService.getMeals(req.params.username, req.query.date)
        .then(meals => {
            res.json(meals);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    mealService.getMeal(req.params.id)
        .then(meal => {
            if (!meal) return res.status(404).json({error: 'meal not found'});

            res.json(meal);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    if (!req.body.date) req.body.date = moment().tz(appConfig.timezone);

    mealService.createMeal(req.params.username, req.body)
        .then(meal => {
            res.json(meal);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    mealService.updateMeal(req.params.id, req.body)
        .then(meal => {
            if (!meal) return res.status(404).json({error: 'meal not found'});
            res.json(meal);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    mealService.getMeal(req.params.id)
        .then(meal => {
            if (!meal) return res.status(404).json({error: 'meal not found'});
            return mealService.deleteMeal(req.params.id);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;