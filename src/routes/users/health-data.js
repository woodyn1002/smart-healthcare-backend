import express from "express";
import {healthDataService} from "../../services/health-data";
import {checkPermission} from "../../check-permission";

const router = express.Router();

router.get('/:username/health-data', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    healthDataService.getHealthData(req.params.username)
        .then(healthData => {
            if (!healthData) return res.status(404).json({error: 'health data not found'});

            res.json(healthData);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.post('/:username/health-data', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    healthDataService.createHealthData(req.params.username, req.body)
        .then(healthData => {
            res.json(healthData);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.put('/:username/health-data', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    healthDataService.updateHealthData(req.params.username, req.body)
        .then(healthData => {
            if (!healthData) return res.status(404).json({error: 'health data not found'});
            res.json(healthData);
        })
        .catch(err => res.status(500).json({error: err}));
});

router.delete('/:username/health-data', function (req, res) {
    if (!checkPermission(req, req.params.username)) return res.status(403).json({error: 'no permission'});

    healthDataService.getHealthData(req.params.username)
        .then(healthData => {
            if (!healthData) return res.status(404).json({error: 'health data not found'});
            return healthDataService.deleteHealthData(req.params.username);
        })
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({error: err}));
});

export default router;