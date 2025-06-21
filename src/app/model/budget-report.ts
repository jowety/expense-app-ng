import { BudgetReportCategory } from "./budget-report-category";

export class BudgetReport {
    year:string | null = null;
    month: string | null = null;
    total: number | null = null;
    categories: BudgetReportCategory[] = [];
}
