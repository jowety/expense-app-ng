import { Recurring } from "./recurring";

export class Util {
    static weekdayMap: { [key: number]: string } = { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday' };
    static weekdays: {name:string, value:number}[]= [
        {name:'Monday',value:1},
        {name:'Tuesday',value:2},
        {name:'Wednesday',value:3}, 
        {name:'Thursday',value:4},
        {name:'Friday',value:5},
        {name:'Saturday',value:6},
        {name:'Sunday',value:7}
    ];
    static months: {name:string, value:number}[] = [
        {name:'January',value:1},
        {name:'February',value:2},
        {name:'March',value:3},
        {name:'April',value:4},
        {name:'May',value:5},
        {name:'June',value:6},
        {name:'July',value:7},
        {name:'August',value:8},
        {name:'September',value:9},
        {name:'October',value:10},
        {name:'November',value:11},
        {name:'December',value:12},
    ];
    static monthDaysMap: { [key: number]: number }= {1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};

    static getDayOfMonthStr(day: number): string {
        if (day == 1) return "1st"
        else if (day == 2) return "2nd";
        else if (day == 3) return "3rd";
        else return day + "th";
    }
    static getWeekday(day: number): string {
        return this.weekdayMap[day];
    }
    static getFreqString(recur: Recurring): string {
        let out = "Every ";
        if (recur.every > 1) out += recur.every + " ";
        if (recur.frequency === 'MONTHS' && recur.every == 1) out += 'month';
        else if (recur.frequency == 'MONTHS' && recur.every > 1) out += 'months';
        else if (recur.frequency == 'YEARS' && recur.every == 1) out += 'year';
        else if (recur.frequency == 'YEARS' && recur.every > 1) out += 'years';
        else if (recur.frequency == 'WEEKS' && recur.every == 1) out += 'week';
        else if (recur.frequency == 'WEEKS' && recur.every > 1) out += 'weeks';
        if (recur.frequency === 'MONTHS') out += " on the " + Util.getDayOfMonthStr(recur.day);
        else if (recur.frequency === 'YEARS') out += ` on ${recur.month}/${recur.day}`;
        else if (recur.frequency === 'WEEKS') out += ` on ${Util.getWeekday(recur.day)}`;
        return out;
    }
    static range(start: number, end: number): number[] {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };
}
