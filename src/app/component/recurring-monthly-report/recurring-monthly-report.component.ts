import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { ExpenseService } from '../../service/expense.service';
import { RecurringMonthlyTotals } from '../../model/recurring-monthly-totals';

@Component({
  selector: 'app-recurring-monthly-report',
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './recurring-monthly-report.component.html',
  styleUrl: './recurring-monthly-report.component.scss'
})
export class RecurringMonthlyReportComponent {
  report: RecurringMonthlyTotals = new RecurringMonthlyTotals();
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private expenseService: ExpenseService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.expenseService.getRecurringMonthlyTotals().subscribe(data => this.report = data);
  }

  getCategoryClass() {
    return 'categoryRow';
  }

  getSubcategoryClass(idx: number) {
    return idx % 2 !== 0 ? 'oddRow subcategoryRow' : 'subcategoryRow';
  }

  formatAmount(value: number | null | undefined): number | null {
    return value == null || value === 0 ? null : value;
  }
}
