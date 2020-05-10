import express from "express";

const router = express.Router();

router.get('/model',
    (req, res) => {
        let file = process.env.APP_EXERCISE_MODEL_URL;
        res.download(file);
    });

router.get('/metadata',
    (req, res) => {
        let file = process.env.APP_EXERCISE_METADATA_URL;
        res.download(file);
    });

router.get('/weights.bin',
    (req, res) => {
        let file = process.env.APP_EXERCISE_WEIGHTS_URL;
        res.download(file);
    });

export default router;