import HealthData from "../models/health-data";
import {HealthDataExistError, HealthDataNotFoundError} from "../errors";

export function getHealthData(username) {
    return HealthData.findOne({username})
        .then(healthData => {
            if (!healthData) throw new HealthDataNotFoundError(username);
            return healthData;
        });
}

export function createHealthData(username, data) {
    return HealthData.findOne({username})
        .then(healthData => {
            if (healthData) throw new HealthDataExistError(username);
            return HealthData.create({
                username,
                sex: data.sex,
                height: data.height,
                weight: data.weight,
                birthdate: data.birthdate,
                ldlCholesterol: data.ldlCholesterol,
                waist: data.waist,
                bloodPressure: data.bloodPressure,
                neutralFat: data.neutralFat,
                hdlCholesterol: data.hdlCholesterol,
                fastingBloodSugar: data.fastingBloodSugar
            });
        });
}

export function updateHealthData(username, data) {
    return HealthData.findOne({username})
        .then(healthData => {
            if (!healthData) throw new HealthDataNotFoundError(username);

            if (data.sex) healthData.sex = data.sex;
            if (data.height) healthData.height = data.height;
            if (data.weight) healthData.weight = data.weight;
            if (data.birthdate) {
                if (data.birthdate.date) healthData.birthdate.date = data.birthdate.date;
                if (data.birthdate.isLunar) healthData.birthdate.isLunar = data.birthdate.isLunar;
            }
            if (data.ldlCholesterol) healthData.ldlCholesterol = data.ldlCholesterol;
            if (data.waist) healthData.waist = data.waist;
            if (data.bloodPressure) {
                healthData.bloodPressure.min = data.bloodPressure.min;
                healthData.bloodPressure.max = data.bloodPressure.max;
                healthData.bloodPressure.medicine = data.bloodPressure.medicine;
            }
            if (data.neutralFat) {
                healthData.neutralFat.fatigue = data.neutralFat.fatigue;
                healthData.neutralFat.medicine = data.neutralFat.medicine;
            }
            if (data.hdlCholesterol) healthData.hdlCholesterol = data.hdlCholesterol;
            if (data.fastingBloodSugar) {
                healthData.fastingBloodSugar.fatigue = data.fastingBloodSugar.fatigue;
                healthData.fastingBloodSugar.medicine = data.fastingBloodSugar.medicine;
            }

            return healthData.save();
        });
}

export function deleteHealthData(username) {
    return HealthData.findOneAndDelete({username})
        .then(healthData => {
            if (!healthData) throw new HealthDataNotFoundError(username);
        });
}