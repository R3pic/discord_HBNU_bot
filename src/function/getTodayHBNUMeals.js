import puppeteer from 'puppeteer';
import logger from "../logger/logger.js";

const url = "https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do";

/*
 * console.log에 존재하는 데이터를 이용하여 작동하는 함수. getTodayMeal과 결과물이 다르다.
 * !! TodayMeal클래스의 인스턴스를 반환하지 않음 !!
 * @deprecated using getTodayMeals
 */
const getTodayHBNUMeals = async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: "/usr/bin/chromium-browser"
        });
        const page = await browser.newPage();

        let log_data;

        page.on('console', async msg => {
            const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
            for (let i = 0; i < args.length; ++i){
                log_data = args[i];
            }
        });

        await page.goto(url);
        await page.setViewport({ width: 1080, height: 1024 });
        await browser.close();

        const launch = log_data[1];
        const dinner = log_data[2];

        const week_start_day = new Date(launch.bgnde);
        const today = new Date();

        const diffDays = Math.floor((today - week_start_day) / (1000 * 60 * 60 * 24));

        const key = `menu${(diffDays % 5) + 1}`

        return {
            launch: launch[key],
            dinner: dinner[key],
        }
    } catch (error) {
        logger.error('Error: ', error);
        return undefined;
    }
};

export default getTodayHBNUMeals;