import Exercise from "../models/exercise";

class ExerciseService {
    getExercises() {
        return Exercise.find();
    }

    getExercise(name) {
        return Exercise.findOne({name});
    }

    createExercise(name, met) {
        const exercise = new Exercise({
            name,
            met
        });

        return exercise.save();
    }

    updateExercise(name, met) {
        return Exercise.findOne({name})
            .then(exercise => {
                if (!exercise) return;
                if (met) exercise.met = met;
                return exercise.save();
            });
    }

    deleteExercise(name) {
        return Exercise.deleteOne({name});
    }
}

export let exerciseService = new ExerciseService();