import express from "express";
import * as ExerciseService from "../../services/exercise";
import validators from "../../middlewares/validators";
import {ExerciseExistError, ExerciseNotFoundError} from "../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof ExerciseNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else if (err instanceof ExerciseExistError) {
        res.status(409).json({error: err.name, message: err.message});
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
        ExerciseService.getExercise(req.params.name)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        ExerciseService.createExercise(req.body.name, req.body.met)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.put('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        ExerciseService.updateExercise(req.params.name, req.body.met)
            .then(exercise => res.json(exercise))
            .catch(err => respondError(res, err));
    });

router.delete('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        ExerciseService.deleteExercise(req.params.name)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;