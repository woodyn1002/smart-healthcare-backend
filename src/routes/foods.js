import express from "express";
import validators from "../middlewares/validators";
import * as FoodService from "../services/food";

const router = express.Router();

router.get('/',
    (req, res) => {
        FoodService.getFoods()
            .then(foods => {
                res.json(foods);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.get('/:name',
    (req, res) => {
        FoodService.getFood(req.params.name)
            .then(food => {
                if (!food) return res.status(404).json({error: 'food not found'});

                res.json(food);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        FoodService.createFood(req.body.name, req.body.calories)
            .then(food => {
                res.json(food);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.put('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        FoodService.updateFood(req.params.name, req.body.calories)
            .then(food => {
                if (!food) return res.status(404).json({error: 'food not found'});
                res.json(food);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.delete('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        FoodService.getFood(req.params.name)
            .then(food => {
                if (!food) return res.status(404).json({error: 'food not found'});
                return FoodService.deleteFood(req.params.name);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    });

export default router;