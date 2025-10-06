import { Stats } from "./stats";

export class ReportMonthValues {
    name:string | null = null;
    monthTotals: { [key: string]: number } = {};
    subs: ReportMonthValues[] = [];
    stats: Stats | null = new Stats();
}
