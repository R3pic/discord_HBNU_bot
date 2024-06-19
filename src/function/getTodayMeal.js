import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import {TodayMeal} from "../model/TodayMeal.js";
import logger from "../logger/logger.js";

/* expected html
* <html>
  <head></head>
  <body>
    금주의 식단에 대한 내용으로 월, 화, 수, 목, 금요일의 조식, 중식, 석식에 대한 내용을 설명합니다.
    <div class="rows week"><span>비고</span></div>
    <div class="rows week">월<span>MON</span><em>(2024-06-17)</em></div>
    <div class="rows week">화<span>TUE</span><em>(2024-06-18)</em></div>
    <div class="rows week">수<span>WED</span><em>(2024-06-19)</em></div>
    <div class="rows week">목<span>THU</span><em>(2024-06-20)</em></div>
    <div class="rows week">금<span>FRI</span><em>(2024-06-21)</em></div>
    <strong>조식<i>09:00 ~ 11:00</i></strong>
    <div class="obj"></div>
    <div class="obj"></div>
    <div class="obj"></div>
    <div class="obj"></div>
    <div class="obj"></div>
    <strong>중식<i>11:00 ~ 14:00</i></strong>
    <div class="obj">
      스팸김치볶음밥<br />
      열무된장국<br />
      떡갈비조림<br />
      샐러드파스타<br />
      양념마늘쫑장아찌<br />
      <br />
      배추김치<br />
      크림스프<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj">
      백미밥<br />
      해물순두부탕<br />
      대패삼겹구이*쌈장<br />
      한식잡채<br />
      콘슬로우샐러드<br />
      <br />
      배추김치<br />
      오미자수박화채<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj">
      짜장밥<br />
      계란국<br />
      버터알감자<br />
      야채비빔만두<br />
      무짠지<br />
      <br />
      배추김치<br />
      오렌지주스<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj"></div>
    <div class="obj"></div>
    <strong>석식<i>17:00 ~ 18:30</i></strong>
    <div class="obj">
      후리가케밥<br />
      얼큰이칼국수<br />
      물총조개탕*와사비장<br />
      호박야채전<br />
      오이탕탕이<br />
      <br />
      배추겉절이<br />
      크림스프<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj">
      백미밥<br />
      청국장<br />
      닭볶음탕<br />
      미니돈까스*머스타드<br />
      청경채나물<br />
      <br />
      배추김치<br />
      오미자수박화채<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj">
      백미밥<br />
      콩나물냉국<br />
      비엔나브로콜리케찹볶음<br />
      크림수제비뇨끼<br />
      그릴드버섯샐러드<br />
      <br />
      배추김치<br />
      오렌지주스<br />
      셀프계란후라이<br />
      식빵&amp;딸기잼<br />
      구운파래김/숭늉<br />
    </div>
    <div class="obj"></div>
    <div class="obj"></div>
  </body>
</html>

* */

const url = "https://www.hanbat.ac.kr/prog/carteGuidance/kor/sub06_030301/C1/calendar.do";

/*
 * @returns {TodayMeal}
 */
const getTodayMeal = async () => {
    let browser;
    try {
        browser = await puppeteer.launch({
            executablePath: puppeteer.executablePath(),
            headless: true, // gui 없이 사용함. 더 빠름.
        });

        const page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({ width: 1080, height: 1024 });

        const content = await page.$eval('#coltable', table => table.innerHTML);

        await page.close();
        // console.log(content);

        const $ = cheerio.load(content); // cheerio객체로 변환하면 html이 조금 바뀌기 때문에 그걸 기준으로 파싱함.

        const mealData = {};

        const dates = [];
        $('.rows.week em').each((index, element) => {
            const date = $(element).text().replace(/[()]/g, '');
            dates.push(date);
        });

        dates.forEach(date => {
            mealData[date] = {
                '조식': [], // 안쓰이지만 쓸일이 생길지도 ...?
                '중식': [],
                '석식': []
            };
        });

        $('.obj').each((index, element) => {
            const mealType = $(element).prevAll('strong').first().text().slice(0,2).trim();
            const meals = $(element).html().split('<br>').map(item => item.replace("amp;", "").trim()).filter(item => item !== '');

            if (mealType && dates[index % dates.length]) {
                const date = dates[index % dates.length];
                mealData[date][mealType] = meals;
            }
        });

        logger.debug(`WeekMealData : ${JSON.stringify(mealData, null, 2)}`);
        return new TodayMeal(mealData); // 클래스에서 알아서 오늘의 조식, 중식, 석식만 추출해서 사용함.
    }
    catch (err) {
        console.error(err);
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
};

export default getTodayMeal;