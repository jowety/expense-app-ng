import { ExpenseReportCategory } from "./expense-report-category";

export class ExpenseReport {
    year:string | null = null;
    months: string[] = [];
    monthTotals: { [key: string]: number } = {};
    categories: ExpenseReportCategory[] = [];
}
