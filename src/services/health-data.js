import HealthData from "../models/health-data";

class HealthDataService {
    getHealthData(username) {
        return HealthData.findOne({username});
    }

    createHealthData(username, data) {
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
    }

    updateHealthData(username, data) {
        return HealthData.findOne({username})
            .then(healthData => {
                if (!healthData) return;

                if (data.sex) healthData.sex = data.sex;
                if (data.height) healthData.height = data.height;
                if (data.weight) healthData.weight = data.weight;
                if (data.birthdate) {
                    if (data.birthdate.date) healthData.birthdate.date = data.birthdate.date;
                    if (data.birthdate.isLunar) healthData.birthdate.isLunar = data.birthdate.isLunar;
                }
                if (data.ldlCholesterol) healthData.ldlCholesterol = data.ldlCholesterol;
                if (data.waist) healthData.waist = data.waist;
                if (data.bloodPressure) healthData.bloodPressure = data.bloodPressure;
                if (data.neutralFat) healthData.neutralFat = data.neutralFat;
                if (data.hdlCholesterol) healthData.hdlCholesterol = data.hdlCholesterol;
                if (data.fastingBloodSugar) healthData.fastingBloodSugar = data.fastingBloodSugar;

                return healthData.save();
            });
    }

    deleteHealthData(username) {
        return HealthData.deleteOne({username});
    }
}

export let healthDataService = new HealthDataService();