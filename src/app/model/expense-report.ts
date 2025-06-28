import { ReportMonthValues } from "./report-month-values";

export class ExpenseReport {
    year:string | null = null;
    months: string[] = [];
    monthTotals: { [key: string]: number } = {};
    categories: ReportMonthValues[] = [];
}
