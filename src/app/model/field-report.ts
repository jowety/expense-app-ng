import { ReportMonthValues } from "./report-month-values";
import { Stats } from "./stats";


export class FieldReport {    
    year: string | null = null;
    months: string[] = [];
    fieldName: string | null = null;
    monthTotals: { [key: string]: number } = {};
    fields: ReportMonthValues[] = [];
    stats: Stats | null = new Stats();
}
