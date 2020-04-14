import moment from "moment";
import * as HealthDataService from "../services/health-data";
import * as FitnessService from "../services/fitness";
import * as MealService from "../services/meal";

export function getMonthlySummary(userId, year, month) {
    return new Promise(async resolve => {
        const fromDate = moment()
            .year(year).month(month)
            .startOf('month');
        const toDate = fromDate.clone()
            .add(1, 'month')
            .startOf('month');

        const [bmrMap, mealCaloriesMap, fitnessCaloriesMap] = await Promise.all([
            getBmrMap(userId, fromDate, toDate),
            getMealCaloriesMap(userId, fromDate, toDate),
            getFitnessCaloriesMap(userId, fromDate, toDate)
        ]);

        let summaryList = [];

        let lastDate = fromDate.clone().endOf('month');
        for (let day = fromDate.date(); day <= lastDate.date(); day++) {
            const date = fromDate.clone().date(day);

            let bmr = bmrMap.get(day);
            let mealCalories = mealCaloriesMap.get(day);
            let fitnessCalories = fitnessCaloriesMap.get(day);
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

function getBmrMap(userId, fromDate, toDate) {
    const lastDate = fromDate.clone().endOf('month');

    return HealthDataService.searchHealthData(userId, {fromDate, toDate, sortByDates: true})
        .then(async healthDataQueue => {
            let bmrMap = new Map();

            const firstHealthData = await HealthDataService.searchHealthData(userId, {
                limit: 1, toDate: fromDate, sortByDatesDesc: true
            });

            let latestBmr = (firstHealthData.length === 0) ? 0 : firstHealthData.bmr;
            for (let day = fromDate.date(); day <= lastDate.date(); day++) {
                while (healthDataQueue.length > 0 && moment(healthDataQueue[0].date).date() <= day) {
                    latestBmr = healthDataQueue[0].bmr || 0;
                    healthDataQueue.shift();
                }
                bmrMap.set(day, latestBmr);
            }
            return bmrMap;
        });
}

function getMealCaloriesMap(userId, fromDate, toDate) {
    const lastDate = fromDate.clone().endOf('month');

    return MealService.searchMeals(userId, {fromDate, toDate, sortByDates: true})
        .then(mealQueue => {
            let caloriesMap = new Map();

            for (let day = fromDate.date(); day <= lastDate.date(); day++) {
                let calories = 0;
                while (mealQueue.length > 0 && moment(mealQueue[0].date).date() === day) {
                    calories += mealQueue[0].totalCalories;
                    mealQueue.shift();
                }
                caloriesMap.set(day, calories);
            }
            return caloriesMap;
        });
}

function getFitnessCaloriesMap(userId, fromDate, toDate) {
    const lastDate = fromDate.clone().endOf('month');

    return FitnessService.searchFitness(userId, {fromDate, toDate, sortByDates: true})
        .then(fitnessQueue => {
            let caloriesMap = new Map();

            for (let day = fromDate.date(); day <= lastDate.date(); day++) {
                let calories = 0;
                while (fitnessQueue.length > 0 && moment(fitnessQueue[0].date).date() === day) {
                    calories += fitnessQueue[0].burntCalories;
                    fitnessQueue.shift();
                }
                caloriesMap.set(day, calories);
            }
            return caloriesMap;
        });
}