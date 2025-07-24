import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../service/expense.service';
import { BudgetReport } from '../../model/budget-report';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-budget-report',
  imports: [TableModule, CommonModule, SelectModule, FloatLabelModule, FormsModule],
  templateUrl: './budget-report.component.html',
  styleUrl: './budget-report.component.scss'
})
export class BudgetReportComponent {

  years: number[] = [];
  year: number = new Date().getFullYear();
  months: string[] = [];
  month: string = new Date().toLocaleString('default', { month: 'long' });
  report: BudgetReport = new BudgetReport();

  constructor(private service: ExpenseService) {
  }

  ngOnInit() {
    this.service.getAvailableYears().subscribe(data => {
      this.years = data;
      this.loadMonths();
      this.load();
    });

    //alert(JSON.stringify(this.report));
  }
  loadMonths() {
    this.service.getAvailableMonths(this.year).subscribe(data =>{
      this.months = data;
    this.month = this.months[0];
    });
  }

  load() {
    this.service.getBudgetReport(this.year, this.month).subscribe(data => this.report = data);
  }
}
