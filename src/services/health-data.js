import HealthData from "../models/health-data";
import {HealthDataExistError, HealthDataNotFoundError} from "../errors";
import moment from "moment";

export function searchHealthData(userId, options) {
    let conditions = {userId};

    if (options.date) {
        let fromDate = moment(options.date).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        let toDate = moment(fromDate).add(1, 'days');
        conditions.date = {$gte: fromDate, $lt: toDate};
    }
    if (options.fromDate) {
        options.fromDate = moment(options.fromDate);
        if (!conditions.date) conditions.date = {};
        conditions.date.$gte = options.fromDate;
    }
    if (options.toDate) {
        options.toDate = moment(options.toDate);
        if (!conditions.date) conditions.date = {};
        conditions.date.$lt = options.toDate;
    }

    let query = HealthData.find(conditions);

    if (options.limit) query = query.limit(options.limit);
    if (options.sortByDates) query = query.sort({date: 1});
    if (options.sortByDatesDesc) query = query.sort({date: -1});

    return query;
}

export function getHealthData(userId, date) {
    return HealthData.findOne({userId, date})
        .then(healthData => {
            if (!healthData) throw new HealthDataNotFoundError(userId);
            return healthData;
        });
}

export function createHealthData(userId, date, data) {
    return HealthData.findOne({userId, date})
        .then(healthData => {
            if (healthData) throw new HealthDataExistError(userId, date);
            return HealthData.create({
                userId,
                date,
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

export function updateHealthData(userId, date, data) {
    return HealthData.findOne({userId, date})
        .then(async healthData => {
            if (!healthData) throw new HealthDataNotFoundError(userId, date);

            if (data.date) {
                let alreadyExists = await exists(userId, data.date);
                if (alreadyExists) throw new HealthDataExistError(userId, data.date);
                healthData.date = data.date;
            }
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
            }
            if (data.bloodPressureMedicine) healthData.bloodPressureMedicine = data.bloodPressureMedicine;
            if (data.neutralFat) healthData.neutralFat = data.neutralFat;
            if (data.neutralFatMedicine) healthData.neutralFatMedicine = data.neutralFatMedicine;
            if (data.hdlCholesterol) healthData.hdlCholesterol = data.hdlCholesterol;
            if (data.fastingBloodSugar) healthData.fastingBloodSugar = data.fastingBloodSugar;
            if (data.fastingBloodSugarMedicine) healthData.fastingBloodSugarMedicine = data.fastingBloodSugarMedicine;

            return healthData.save();
        });
}

export function deleteHealthData(userId, date) {
    return HealthData.findOneAndDelete({userId, date})
        .then(healthData => {
            if (!healthData) throw new HealthDataNotFoundError(userId, date);
        });
}

export function exists(userId, date) {
    return HealthData.exists({userId, date});
}