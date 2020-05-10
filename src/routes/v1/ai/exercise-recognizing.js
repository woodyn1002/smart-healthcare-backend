import express from "express";
const modelJson = require("../../../tf_models/exercise/model.json");
const metadataJson = require("../../../tf_models/exercise/metadata.json");
const weightsBin = require("../../../tf_models/exercise/weights.bin");

const router = express.Router();

router.get('/model',
    (req, res) => {
        res.download(__dirname + modelJson.default);
    });

router.get('/metadata',
    (req, res) => {
        res.download(__dirname + metadataJson.default);
    });

router.get('/weights.bin',
    (req, res) => {
        res.download(__dirname + weightsBin.default);
    });

export default router;