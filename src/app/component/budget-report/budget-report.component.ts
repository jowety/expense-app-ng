import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../service/expense.service';
import { BudgetReport } from '../../model/budget-report';

@Component({
  selector: 'app-budget-report',
  imports: [TableModule, CommonModule],
  templateUrl: './budget-report.component.html',
  styleUrl: './budget-report.component.scss'
})
export class BudgetReportComponent {

  year: number = new Date().getFullYear();
  report: BudgetReport = new BudgetReport();

  constructor(private service: ExpenseService) {
  }
  
  ngOnInit() {
    this.load();
    //alert(JSON.stringify(this.report));
  }

  load() {
    this.service.getBudgetReport(this.year, "June").subscribe(data => this.report = data);
  }
}
