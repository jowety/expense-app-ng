export class ExpenseFilters {
    year: number | null = new Date().getFullYear();
    month: string | null = null;
    payee: string | null = null;
    account: string | null = null;
    category: string | null = null;
    subcategory: string | null = null;
    sortField: string | null = "date";
    sortOrder: number = -1;
    first: number = 0;
    rows: number = 50;
    hideFuture: boolean = false;
}
