import { CcDetail } from "./cc-detail";
import { Stats } from "./stats";

export class ReportMonthValues {
    name:string | null = null;
    monthTotals: { [key: string]: number } = {};
    monthCounts: { [key: string]: number } = {};
    ccDetails: { [key: string]: CcDetail } = {};
    subs: ReportMonthValues[] = [];
    stats: Stats | null = new Stats();
    count:number | null = null;
}
