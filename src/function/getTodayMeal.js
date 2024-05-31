import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// html파싱하는 로직으로
const getTodayMeal = async () => {
    const url = "https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do";
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 페이지 이동 및 설정
        await page.goto(url);
        await page.setViewport({ width: 1080, height: 1024 });

        // thead의 HTML 내용을 가져옴
        const dateHtml = await page.evaluate(() => {
            return document.querySelector('thead').innerHTML;
        });

        // Cheerio를 사용하여 HTML 파싱
        const $ = cheerio.load(dateHtml);

        // 날짜를 저장할 배열
        let dates = [];

        // 각 날짜 요소를 순회하면서 날짜와 인덱스를 추출
        $('.rows.week').each((i, element) => {
            const dateText = $(element).find('em').text(); // 날짜 텍스트 추출
            dates.push({
                index: i,
                date: dateText
            });
        });

        // tbody의 HTML 내용을 가져옴
        const menuHtml = await page.evaluate(() => {
            return document.querySelector('tbody').innerHTML;
        });

        // Cheerio를 사용하여 HTML 파싱
        const menu$ = cheerio.load(menuHtml);

        // 식단 데이터를 저장할 배열
        let menus = [];

        // 각 식단 행을 순회하면서 식단 데이터를 추출
        menu$('tr').each((i, element) => {
            let meals = [];
            menu$(element).find('td .obj').each((j, menuElement) => {
                const mealText = menu$(menuElement).html().replace(/<br>/g, '\n'); // HTML에서 <br> 태그를 줄바꿈으로 변경
                meals.push(mealText.trim());
            });
            menus.push({
                mealType: menu$(element).find('th strong').text(),
                times: menu$(element).find('th i').text(),
                meals: meals
            });
        });

        // 날짜와 식단 데이터를 매칭
        let result = dates.map(date => {
            return {
                date: date.date,
                meals: menus.map(menu => ({
                    mealType: menu.mealType,
                    times: menu.times,
                    meal: menu.meals[date.index - 1] // 날짜 인덱스와 식단 인덱스를 맞추기 위해 -1 사용
                }))
            };
        });

        // 결과 출력
        console.log(result);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
}