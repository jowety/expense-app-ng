export class ReportMonthValues {
    name:string | null = null;
    monthTotals: { [key: string]: number } = {};
    subs: ReportMonthValues[] = [];
}
