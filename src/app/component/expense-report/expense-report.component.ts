import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../service/expense.service';
import { ExpenseReport } from '../../model/expense-report';

@Component({
  selector: 'app-expense-report',
  imports: [TableModule, CommonModule],
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.scss'
})
export class ExpenseReportComponent {
  year: number = new Date().getFullYear();
  report: ExpenseReport = new ExpenseReport();

  constructor(private service: ExpenseService) {
  }
  ngOnInit() {
    this.load();
    //alert(JSON.stringify(this.report));
  }


  load() {
    this.service.getCategoryReport(this.year).subscribe(data => this.report = data);
  }
}
