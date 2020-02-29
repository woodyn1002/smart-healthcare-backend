import express from "express";
import * as HealthDataService from "../../../services/health-data";
import validators from "../../../middlewares/validators";

const router = express.Router();

router.get('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        HealthDataService.getHealthData(req.params.username)
            .then(healthData => {
                if (!healthData) return res.status(404).json({error: 'health data not found'});

                res.json(healthData);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.post('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        HealthDataService.createHealthData(req.params.username, req.body)
            .then(healthData => {
                res.json(healthData);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.put('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        HealthDataService.updateHealthData(req.params.username, req.body)
            .then(healthData => {
                if (!healthData) return res.status(404).json({error: 'health data not found'});
                res.json(healthData);
            })
            .catch(err => res.status(500).json({error: err}));
    });

router.delete('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        HealthDataService.getHealthData(req.params.username)
            .then(healthData => {
                if (!healthData) return res.status(404).json({error: 'health data not found'});
                return HealthDataService.deleteHealthData(req.params.username);
            })
            .then(() => res.status(204).end())
            .catch(err => res.status(500).json({error: err}));
    });

export default router;