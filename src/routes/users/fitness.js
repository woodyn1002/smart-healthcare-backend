import express from "express";
import moment from "moment";
import "moment-timezone";
import {fitnessService} from "../../services/fitness-service";
import {checkPermission} from "../../check-permission";
import appConfig from "../../config/app-config";

const router = express.Router();

router.get('/:username/fitness', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitnessList(req.params.username, req.query.date)
        .then(fitnessList => {
            res.json(fitnessList);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/:username/fitness/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitness(req.params.id)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});

            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/:username/fitness', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    if (!req.body.date) req.body.date = moment().tz(appConfig.timezone);

    fitnessService.createFitness(req.params.username, req.body)
        .then(fitness => {
            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:username/fitness/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.updateFitness(req.params.id, req.body)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});
            res.json(fitness);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:username/fitness/:id', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    fitnessService.getFitness(req.params.id)
        .then(fitness => {
            if (!fitness) return res.status(404).json({error: 'fitness not found'});
            return fitnessService.deleteFitness(req.params.id);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;