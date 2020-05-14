import express from "express";

const kneePushUpModelJson = require("../../../tf_models/exercise/knee-push-up/model.json");
const kneePushUpMetadataJson = require("../../../tf_models/exercise/knee-push-up/metadata.json");
const kneePushUpWeightsBin = require("../../../tf_models/exercise/knee-push-up/weights.bin");

const squatModelJson = require("../../../tf_models/exercise/squat/model.json");
const squatMetadataJson = require("../../../tf_models/exercise/squat/metadata.json");
const squatWeightsBin = require("../../../tf_models/exercise/squat/weights.bin");

const standingSideCrunchModelJson = require("../../../tf_models/exercise/standing-side-crunch/model.json");
const standingSideCrunchMetadataJson = require("../../../tf_models/exercise/standing-side-crunch/metadata.json");
const standingSideCrunchWeightsBin = require("../../../tf_models/exercise/standing-side-crunch/weights.bin");

const router = express.Router();

router.get('/knee-push-up/model', (req, res) => res.download(__dirname + kneePushUpModelJson.default));
router.get('/knee-push-up/metadata', (req, res) => res.download(__dirname + kneePushUpMetadataJson.default));
router.get('/knee-push-up/weights.bin', (req, res) => res.download(__dirname + kneePushUpWeightsBin.default));

router.get('/squat/model', (req, res) => res.download(__dirname + squatModelJson.default));
router.get('/squat/metadata', (req, res) => res.download(__dirname + squatMetadataJson.default));
router.get('/squat/weights.bin', (req, res) => res.download(__dirname + squatWeightsBin.default));

router.get('/standing-side-crunch/model', (req, res) => res.download(__dirname + standingSideCrunchModelJson.default));
router.get('/standing-side-crunch/metadata', (req, res) => res.download(__dirname +
                                                                        standingSideCrunchMetadataJson.default));
router.get('/standing-side-crunch/weights.bin', (req, res) => res.download(__dirname +
                                                                           standingSideCrunchWeightsBin.default));

export default router;