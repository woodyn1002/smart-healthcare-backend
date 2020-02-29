import express from "express";
import "moment-timezone";
import {fitnessService} from "../../services/fitness";
import {checkPermission} from "../../check-permission";

const router = express.Router();

router.get('/:username/fitness', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitnessList(req.params.username, req.query.date)
        .then(fitnessList => {
            res.json(fitnessList);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/:username/fitness/:date', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitness(req.params.username, req.params.date)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});

            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/:username/fitness/:date', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.createFitness(req.params.username, req.params.date, req.body)
        .then(fitness => {
            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:username/fitness/:name', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.updateFitness(req.params.username, req.params.date, req.body)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});
            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:username/fitness/:name', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitness(req.params.username, req.params.date)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});
            return fitnessService.deleteFitness(req.params.username, req.params.date);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;