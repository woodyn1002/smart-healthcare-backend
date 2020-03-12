import express from "express";
import Joi from "joi";
import validators from "../../../middlewares/validators";
import * as FitnessService from "../../../services/fitness";
import {FitnessExistError, FitnessNotFoundError} from "../../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof FitnessExistError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof FitnessNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/fitness',
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

        FitnessService.searchFitness(username, options)
            .then(fitnessList => res.json(fitnessList))
            .catch(err => respondError(res, err));
    });

router.get('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {username, date} = req.params;

        FitnessService.getFitness(username, date)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.post('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        exerciseId: Joi.string().required(),
        burntCalories: Joi.number().positive().required(),
        count: Joi.number().positive().required(),
        elapsedTime: Joi.number().positive().required(),
        intensity: Joi.number().min(0).max(4)
    }),
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        FitnessService.createFitness(username, date, data)
            .then(fitness => res.status(201).json(fitness))
            .catch(err => respondError(res, err));
    });

router.put('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        exerciseId: Joi.string().required(),
        burntCalories: Joi.number().positive().required(),
        count: Joi.number().positive().required(),
        elapsedTime: Joi.number().positive().required(),
        intensity: Joi.number().min(0).max(4)
    }),
    (req, res) => {
        const {username, date} = req.params;
        const data = req.body;

        FitnessService.updateFitness(username, date, data)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        username: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {username, date} = req.params;

        FitnessService.deleteFitness(username, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;