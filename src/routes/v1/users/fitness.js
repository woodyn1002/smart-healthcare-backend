import express from "express";
import validators from "../../../middlewares/validators";
import * as FitnessService from "../../../services/fitness";

const router = express.Router();

router.get('/:username/fitness',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.getFitnessList(req.params.username, req.query.date)
            .then(fitnessList => {
                res.json(fitnessList);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.get('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.getFitness(req.params.username, req.params.date)
            .then(fitness => {
                if (!fitness) return res.status(404).json({error: 'fitness not found'});

                res.json(fitness);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.post('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.createFitness(req.params.username, req.params.date, req.body)
            .then(fitness => {
                res.json(fitness);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.put('/:username/fitness/:name',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.updateFitness(req.params.username, req.params.date, req.body)
            .then(fitness => {
                if (!fitness) return res.status(404).json({error: 'fitness not found'});
                res.json(fitness);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.delete('/:username/fitness/:name',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.getFitness(req.params.username, req.params.date)
            .then(fitness => {
                if (!fitness) return res.status(404).json({error: 'fitness not found'});
                return FitnessService.deleteFitness(req.params.username, req.params.date);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    });

export default router;