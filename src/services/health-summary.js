import moment from "moment";
import * as HealthDataService from "../services/health-data";
import * as FitnessService from "../services/fitness";
import * as MealService from "../services/meal";

export function getMonthlySummary(userId, year, month) {
    return new Promise(async resolve => {
        const startDate = moment()
            .year(year).month(month)
            .startOf('month');
        const endDate = startDate.clone()
            .endOf('month');

        let summaryList = [];

        for (let day = startDate.date(); day <= endDate.date(); day++) {
            const date = startDate.clone().date(day);

            const [bmr, mealCalories, fitnessCalories] = await Promise.all([
                getBmr(userId, date),
                getMealCalories(userId, date),
                getFitnessCalories(userId, date)
            ]);

            let summary = {
                date, day,
                bmr, mealCalories, fitnessCalories,
                sumOfCalories: mealCalories - bmr - fitnessCalories
            }
            summaryList.push(summary);
        }
        resolve(summaryList);
    });
}

function getBmr(userId, date) {
    let toDate = moment(date)
        .add(1, 'day')
        .startOf('day');
    return HealthDataService.searchHealthData(userId, {limit: 1, toDate, sortByDatesDesc: true})
        .then(healthDataList => {
            if (healthDataList.length === 0) {
                return 0;
            }
            return healthDataList[0].bmr;
        });
}

const sum = (a, b) => a + b;

function getMealCalories(userId, date) {
    return MealService.searchMeals(userId, {date})
        .then(meals => meals.map(it => it.totalCalories).reduce(sum, 0));
}

function getFitnessCalories(userId, date) {
    return FitnessService.searchFitness(userId, {date})
        .then(fitnessList => fitnessList.map(it => it.burntCalories).reduce(sum, 0));
}