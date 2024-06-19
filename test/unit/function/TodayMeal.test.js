import getTodayMeal from "../../../src/function/getTodayMeal.js";

const meals = await getTodayMeal();

console.log("현재 객체 : ",meals);

console.log("조식 : ", meals.breakfast);
console.log("중식 : ", meals.lunch);
console.log("석식 : ", meals.dinner);