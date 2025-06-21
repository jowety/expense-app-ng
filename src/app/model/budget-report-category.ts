import { BudgetReportSubcategory } from "./budget-report-subcategory";

export class BudgetReportCategory {   
    name: string | null = null;
    total: number | null = null;
    budget: number | null = null;
    subcategories: BudgetReportSubcategory[] = [];
}
