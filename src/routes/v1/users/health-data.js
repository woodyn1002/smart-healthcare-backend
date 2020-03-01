import express from "express";
import * as HealthDataService from "../../../services/health-data";
import validators from "../../../middlewares/validators";
import {HealthDataExistError, HealthDataNotFoundError} from "../../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof HealthDataExistError) {
        res.status(403).json({error: err.name, message: err.message});
    } else if (err instanceof HealthDataNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const username = req.params.username;

        HealthDataService.getHealthData(username)
            .then(healthData => res.json(healthData))
            .catch(err => respondError(res, err));
    });

router.post('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const username = req.params.username;
        const data = req.body;

        HealthDataService.createHealthData(username, data)
            .then(healthData => res.json(healthData))
            .catch(err => respondError(res, err));
    });

router.put('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const username = req.params.username;
        const data = req.body;

        HealthDataService.updateHealthData(username, data)
            .then(healthData => res.json(healthData))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/health-data',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        const username = req.params.username;

        HealthDataService.deleteHealthData(username)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;