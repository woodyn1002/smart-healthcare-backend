import express from "express";
import {exerciseService} from "../services/exercise-service";
import {checkPermission} from "../check-permission";

const router = express.Router();

router.get('/', function (req, res) {
    exerciseService.getExercises()
        .then(exercises => {
            res.json(exercises);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/:id', function (req, res) {
    exerciseService.getExercise(req.params.id)
        .then(exercise => {
            if (!exercise) return res.status(404).json({error: 'exercise not found'});

            res.json(exercise);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    exerciseService.createExercise(req.body.name, req.body.met)
        .then(exercise => {
            res.json(exercise);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:id', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    exerciseService.updateExercise(req.params.id, req.body.name, req.body.met)
        .then(exercise => {
            if (!exercise) return res.status(404).json({error: 'exercise not found'});
            res.json(exercise);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:id', function (req, res) {
    if (!checkPermission(req)) return res.status(403).json({error: 'no permission'});

    exerciseService.getExercise(req.params.id)
        .then(exercise => {
            if (!exercise) return res.status(404).json({error: 'exercise not found'});
            return exerciseService.deleteExercise(req.params.id);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;