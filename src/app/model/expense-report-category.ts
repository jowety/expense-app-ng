import { ExpenseReportSubcategory } from "./expense-report-subcategory";

export class ExpenseReportCategory {
    name:string | null = null;
    monthTotals: { [key: string]: number } = {};
    subcategories: ExpenseReportSubcategory[] = [];
}
