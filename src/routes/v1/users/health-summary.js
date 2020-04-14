import express from "express";
import Joi from "joi";
import * as HealthSummaryService from "../../../services/health-summary";
import validators from "../../../middlewares/validators";

const router = express.Router();

const respondError = (res, err) => {
    console.error(err);
    res.status(500).end();
};

router.get('/:userId/health-summary/:year/:month',
    validators.loggedIn, validators.canManageUser,
    validators.params({
        userId: Joi.string().required(),
        year: Joi.number().positive(),
        month: Joi.number().min(0).max(11)
    }),
    (req, res) => {
        const {userId, year, month} = req.params;

        HealthSummaryService.getMonthlySummary(userId, year, month)
            .then(healthSummary => res.json(healthSummary))
            .catch(err => respondError(res, err));
    });

export default router;