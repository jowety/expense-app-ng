import { ReportMonthValues } from "./report-month-values";


export class FieldReport {    
    year: string | null = null;
    months: string[] = [];
    fieldName: string | null = null;
    monthTotals: { [key: string]: number } = {};
    fields: ReportMonthValues[] = [];
}
