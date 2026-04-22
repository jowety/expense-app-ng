export class ReportFilters {    
  year: number | null = null;
  field: string  = 'Category';
  collapse: boolean = false;
  showMonths: boolean = true;
  showStats: boolean = false;
  monthSortLR: boolean = true;
  monthsReversed: string[] | null = null;
}
