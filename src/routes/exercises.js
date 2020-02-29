import express from "express";
import {exerciseService} from "../services/exercise";
import validators from "../middlewares/validators";

const router = express.Router();

router.get('/',
    (req, res) => {
        exerciseService.getExercises()
            .then(exercises => {
                res.json(exercises);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.get('/:name',
    (req, res) => {
        exerciseService.getExercise(req.params.name)
            .then(exercise => {
                if (!exercise) return res.status(404).json({error: 'exercise not found'});

                res.json(exercise);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.post('/',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        exerciseService.createExercise(req.body.name, req.body.met)
            .then(exercise => {
                res.json(exercise);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.put('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        exerciseService.updateExercise(req.params.name, req.body.met)
            .then(exercise => {
                if (!exercise) return res.status(404).json({error: 'exercise not found'});
                res.json(exercise);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.delete('/:name',
    validators.loggedIn, validators.isAdmin,
    (req, res) => {
        exerciseService.getExercise(req.params.name)
            .then(exercise => {
                if (!exercise) return res.status(404).json({error: 'exercise not found'});
                return exerciseService.deleteExercise(req.params.name);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    });

export default router;