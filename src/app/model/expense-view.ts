export class ExpenseView {
        id: number | null = null;
        date: Date | string | null = null;
        year: number | null = null;
        monthNumber: number | null = null;
        monthString: string | null = null;
        account: string | null = null;
        payee: string | null = null;
        category: string | null = null;
        subcategory: string | null = null;
        amount: number | null = null;
        notes: string | null = null;
        autoInsert: boolean = false;
        estimate: boolean = false;
        closingDate: Date | string | null = null;
        closingYear: number | null = null;
        closingMonthNumber: number | null = null;
        closingMonthString: string | null = null;
        cleared: boolean = false;
        parent: boolean = false;
        parentId: number | null = null;
}
