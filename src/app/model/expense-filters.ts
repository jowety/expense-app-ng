export class ExpenseFilters {
    year: string | null = new Date().getFullYear().toString();
    month: string | null = new Date().toLocaleString('default', { month: 'long' });
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
