import express from "express";
import {foodService} from "../services/food-service";
import {checkPermission} from "../check-permission";

const router = express.Router();

router.get('/', function (req, res) {
    foodService.getFoods()
        .then(foods => {
            res.json(foods);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/:name', function (req, res) {
    foodService.getFood(req.params.name)
        .then(food => {
            if (!food) return res.status(404).json({error: 'food not found'});

            res.json(food);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    foodService.createFood(req.body.name, req.body.calories)
        .then(food => {
            res.json(food);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:name', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    foodService.updateFood(req.params.name, req.body.calories)
        .then(food => {
            if (!food) return res.status(404).json({error: 'food not found'});
            res.json(food);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:name', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    foodService.getFood(req.params.name)
        .then(food => {
            if (!food) return res.status(404).json({error: 'food not found'});
            return foodService.deleteFood(req.params.name);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;