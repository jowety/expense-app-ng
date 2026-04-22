export class ExpenseFilters {
    year: number | null = null;
    month: string | null = null;
    payee: string | null = null;
    account: string | null = null;
    category: string | null = null;
    subcategory: string | null = null;
    notes: string | null = null;
    sortField: string | null = "date";
    sortOrder: number = -1;
    first: number = 0;
    rows: number = 100;
    hideFuture: boolean = false;
    closingView: boolean = false;
}
