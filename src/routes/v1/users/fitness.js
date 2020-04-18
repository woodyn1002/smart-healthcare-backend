import express from "express";
import Joi from "joi";
import validators from "../../../middlewares/validators";
import * as FitnessService from "../../../services/fitness";
import {ExerciseNotFoundError, FitnessExistError, FitnessNotFoundError} from "../../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof FitnessExistError) {
        res.status(403).json({error: {name: err.name, message: err.message}});
    } else if (err instanceof FitnessNotFoundError || err instanceof ExerciseNotFoundError) {
        res.status(404).json({error: {name: err.name, message: err.message}});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:userId/fitness',
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

        FitnessService.searchFitness(userId, options)
            .then(fitnessList => res.json(fitnessList))
            .catch(err => respondError(res, err));
    });

router.get('/:userId/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        FitnessService.getFitness(userId, date)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

const exerciseValidator = (req, res, next) => {
    let data = req.body;
    if (!data.exerciseId && !data.exercise)
        return res.status(403).json({
            error: {name: 'ValidationError', message: 'Field exerciseId or exercise must be provided'}
        });
    if (data.exercise && !data.exercise.name)
        return res.status(403).json({
            error: {name: 'ValidationError', message: 'Field exercise.name must be provided'}
        });
    next();
};

router.post('/:userId/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        exerciseId: Joi.string(),
        exercise: {
            name: Joi.string(),
            met: Joi.number().positive()
        },
        burntCalories: Joi.number().positive().required(),
        count: Joi.number().positive().required(),
        elapsedTime: Joi.number().positive().required(),
        intensity: Joi.number().min(0).max(4)
    }),
    exerciseValidator,
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        FitnessService.createFitness(userId, date, data)
            .then(fitness => res.status(201).json(fitness))
            .catch(err => respondError(res, err));
    });

router.put('/:userId/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    validators.body({
        date: Joi.string().isoDate(),
        exerciseId: Joi.string(),
        exercise: {
            name: Joi.string(),
            met: Joi.number().positive()
        },
        burntCalories: Joi.number().positive().required(),
        count: Joi.number().positive().required(),
        elapsedTime: Joi.number().positive().required(),
        intensity: Joi.number().min(0).max(4)
    }),
    exerciseValidator,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        FitnessService.updateFitness(userId, date, data)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.delete('/:userId/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        FitnessService.deleteFitness(userId, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;