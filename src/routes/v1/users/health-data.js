import express from "express";
import * as HealthDataService from "../../../services/health-data";
import validators from "../../../middlewares/validators";
import {HealthDataExistError, HealthDataNotFoundError} from "../../../errors";
import Joi from "joi";

const router = express.Router();

const healthDataBodyValidator = validators.body({
    sex: Joi.string().valid('male', 'female'),
    height: Joi.number().positive(),
    weight: Joi.number().positive(),
    birthdate: {
        date: Joi.string().isoDate(),
        isLunar: Joi.boolean()
    },
    ldlCholesterol: Joi.number().positive(),
    waist: Joi.number().positive(),
    bloodPressure: {
        min: Joi.number().positive(),
        max: Joi.number().positive().min(Joi.ref('min'))
    },
    bloodPressureMedicine: Joi.boolean(),
    neutralFat: Joi.number().positive(),
    neutralFatMedicine: Joi.boolean(),
    hdlCholesterol: Joi.number().positive(),
    fastingBloodSugar: Joi.number().positive(),
    fastingBloodSugarMedicine: Joi.boolean()
});

const respondError = (res, err) => {
    if (err instanceof HealthDataExistError) {
        res.status(403).json({error: {name: err.name, message: err.message}});
    } else if (err instanceof HealthDataNotFoundError) {
        res.status(404).json({error: {name: err.name, message: err.message}});
    } else {
        console.error(err);
        res.status(500).end();
    }
};

router.get('/:userId/health-data',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required()
    }),
    validators.query({
        date: Joi.string().isoDate(),
        fromDate: Joi.string().isoDate(),
        toDate: Joi.string().isoDate(),
        limit: Joi.number().positive(),
        sortByDates: Joi.boolean(),
        sortByDatesDesc: Joi.boolean()
    }),
    (req, res) => {
        const userId = req.params.userId;
        const options = req.query;

        if (options.limit) options.limit = Number(options.limit);
        if (options.sortByDates) options.sortByDates = Boolean(options.sortByDates);
        if (options.sortByDatesDesc) options.sortByDatesDesc = Boolean(options.sortByDatesDesc);

        HealthDataService.searchHealthData(userId, options)
            .then(healthDataList => res.json(healthDataList))
            .catch(err => respondError(res, err));
    });

router.get('/:userId/health-data/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        HealthDataService.getHealthData(userId, date)
            .then(healthData => res.json(healthData))
            .catch(err => respondError(res, err));
    });

router.post('/:userId/health-data/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    healthDataBodyValidator,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        HealthDataService.createHealthData(userId, date, data)
            .then(healthData => res.status(201).json(healthData))
            .catch(err => respondError(res, err));
    });

router.put('/:userId/health-data/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    healthDataBodyValidator,
    (req, res) => {
        const {userId, date} = req.params;
        const data = req.body;

        HealthDataService.updateHealthData(userId, date, data)
            .then(healthData => res.json(healthData))
            .catch(err => respondError(res, err));
    });

router.delete('/:userId/health-data/:date',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        date: Joi.string().isoDate().required()
    }),
    (req, res) => {
        const {userId, date} = req.params;

        HealthDataService.deleteHealthData(userId, date)
            .then(() => res.status(204).end())
            .catch(err => respondError(res, err));
    });

export default router;