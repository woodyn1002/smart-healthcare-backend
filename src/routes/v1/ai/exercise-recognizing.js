import express from "express";

const router = express.Router();

router.get('/knee-push-up/model',
    (req, res) => res.download("./dist/tf_models/exercise/knee-push-up/model.json"));
router.get('/knee-push-up/metadata',
    (req, res) => res.download("./dist/tf_models/exercise/knee-push-up/metadata.json"));
router.get('/knee-push-up/weights.bin',
    (req, res) => res.download("./dist/tf_models/exercise/knee-push-up/weights.bin"));

router.get('/squat/model',
    (req, res) => res.download("./dist/tf_models/exercise/squat/model.json"));
router.get('/squat/metadata',
    (req, res) => res.download("./dist/tf_models/exercise/squat/metadata.json"));
router.get('/squat/weights.bin',
    (req, res) => res.download("./dist/tf_models/exercise/squat/weights.bin"));

router.get('/standing-side-crunch/model',
    (req, res) => res.download("./dist/tf_models/exercise/standing-side-crunch/model.json"));
router.get('/standing-side-crunch/metadata',
    (req, res) => res.download("./dist/tf_models/exercise/standing-side-crunch/metadata.json"));
router.get('/standing-side-crunch/weights.bin',
    (req, res) => res.download("./dist/tf_models/exercise/standing-side-crunch/weights.bin"));

export default router;