import puppeteer from 'puppeteer';
import logger from "../logger/logger.js";

const url = "https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do";

// Console.log에 존재하는 객체를 이용함.
const getTodayHBNUMeals = async () => {
    try {
        const browser = await puppeteer.launch();
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