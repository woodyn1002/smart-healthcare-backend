import express from "express";
import validators from "../../../middlewares/validators";
import * as FitnessService from "../../../services/fitness";
import {FitnessExistError, FitnessNotFoundError} from "../../../errors";

const router = express.Router();

const respondError = (res, err) => {
    if (err instanceof FitnessNotFoundError) {
        res.status(404).json({error: err.name, message: err.message});
    } else if (err instanceof FitnessExistError) {
        res.status(409).json({error: err.name, message: err.message});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:username/fitness',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.getFitnessList(req.params.username, req.query.date)
            .then(fitnessList => res.json(fitnessList))
            .catch(err => respondError(res, err));
    });

router.get('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.getFitness(req.params.username, req.params.date)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.post('/:username/fitness/:date',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.createFitness(req.params.username, req.params.date, req.body)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.put('/:username/fitness/:name',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.updateFitness(req.params.username, req.params.date, req.body)
            .then(fitness => res.json(fitness))
            .catch(err => respondError(res, err));
    });

router.delete('/:username/fitness/:name',
    validators.loggedIn, validators.canManageUser,
    (req, res) => {
        FitnessService.deleteFitness(req.params.username, req.params.date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;