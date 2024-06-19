// 각 날짜가 key인 객체를 받아서 오늘 날짜에 해당하는 (조식, 중식, 석식)을 추출하여 문자열로 저장하는 클래스.

/*
 * yyyy-mm-dd 형태의 key를 가진 객체를 매개변수로 오늘 날짜에 해당하는 (조식, 중식, 석식)을
 * breakfast, lunch, dinner 속성에 저장하는 클래스
 */
export class TodayMeal {
    /*
     * @params {key : yyyy-mm-dd, value : list} 인 객체
     */
    constructor(data) {
        this.breakfast = "";
        this.lunch = "";
        this.dinner = "";
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const [dateString, meals] of Object.entries(data)) {
            const date = new Date(dateString);
            date.setHours(0, 0, 0, 0);

            if (date.getTime() === today.getTime()) {
                this.breakfast = meals['조식'].join("\n") || "";
                this.lunch = meals['중식'].join("\n") || "";
                this.dinner = meals['석식'].join("\n") || "";
                return;
            }
        }
    }
}