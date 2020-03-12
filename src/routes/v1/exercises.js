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

router.get('/:exerciseId',
    (req, res) => {
        const id = req.params.exerciseId;

        ExerciseService.getExercise(id)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    validators.body({
        id: Joi.string().required(),
        name: Joi.string().required(),
        met: Joi.number().positive().required()
    }),
    (req, res) => {
        const {id, name, met} = req.body;

        ExerciseService.createExercise(id, name, met)
            .then(exercise => res.status(201).json(exercise))
            .catch(err => respondError(res, err));
    });

router.put('/:exerciseId',
    validators.loggedIn, validators.isAdmin,
    validators.body({
        name: Joi.string(),
        met: Joi.number().positive()
    }),
    (req, res) => {
        const id = req.params.exerciseId;
        const {name, met} = req.body;

        ExerciseService.updateExercise(id, name, met)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.delete('/:exerciseId',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        const id = req.params.exerciseId;

        ExerciseService.deleteExercise(id)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;