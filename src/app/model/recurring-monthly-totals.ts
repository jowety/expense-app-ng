export class RecurringMonthlyTotals {
    name: string | null = null;
    yearTotal: number | null = null;
    monthTotals: number[] = [];
    subs: RecurringMonthlyTotals[] = [];
}
