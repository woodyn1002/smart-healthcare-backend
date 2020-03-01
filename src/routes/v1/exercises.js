import express from "express";
import * as ExerciseService from "../../services/exercise";
import validators from "../../middlewares/validators";
import {ExerciseExistError, ExerciseNotFoundError} from "../../errors";
import Joi from "joi";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof ExerciseExistError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof ExerciseNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/',
    (req, res) => {
        ExerciseService.getExercises()
            .then(exercises => res.json(exercises))
            .catch(err => respondError(res, err));
    });

router.get('/:name',
    (req, res) => {
        const name = req.params.name;

        ExerciseService.getExercise(name)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    validators.body({
        name: Joi.string().required(),
        met: Joi.number().positive().required()
    }),
    (req, res) => {
        const {name, met} = req.body;

        ExerciseService.createExercise(name, met)
            .then(exercise => res.status(201).json(exercise))
            .catch(err => respondError(res, err));
    });

router.put('/:name',
    validators.loggedIn, validators.isAdmin,
    validators.body({
        met: Joi.number().positive().required()
    }),
    (req, res) => {
        const name = req.params.name;
        const met = req.body.met;

        ExerciseService.updateExercise(name, met)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.delete('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        const name = req.params.name;

        ExerciseService.deleteExercise(name)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;