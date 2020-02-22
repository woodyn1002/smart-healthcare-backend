import mongoose from "mongoose";
import Exercise from "../models/exercise";

class ExerciseService {
    getExercises() {
        return Exercise.find();
    }

    getExercise(id) {
        return Exercise.findOne({_id: mongoose.Types.ObjectId(id)});
    }

    createExercise(name, met) {
        const exercise = new Exercise({
            name,
            met
        });

        return exercise.save();
    }

    updateExercise(id, name, met) {
        return Exercise.findOne({_id: mongoose.Types.ObjectId(id)})
            .then(exercise => {
                if (!exercise) return;
                if (name) exercise.name = name;
                if (met) exercise.met = met;
                return exercise.save();
            });
    }

    deleteExercise(id) {
        return Exercise.deleteOne({_id: mongoose.Types.ObjectId(id)});
    }
}

export let exerciseService = new ExerciseService();