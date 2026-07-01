import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../service/expense.service';
import { BudgetReport } from '../../model/budget-report';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Router} from '@angular/router';

@Component({
  selector: 'app-budget-report',
  imports: [TableModule, CommonModule, SelectModule, FloatLabelModule, FormsModule, ToggleSwitchModule],
  templateUrl: './budget-report.component.html',
  styleUrl: './budget-report.component.scss'
})
export class BudgetReportComponent {

  years: number[] = [];
  year: number = new Date().getFullYear();
  months: string[] = [];
  month: string = new Date().toLocaleString('default', { month: 'long' });
  report: BudgetReport = new BudgetReport();
  collapse: boolean = false;
  showAll: boolean = false;

  constructor(private service: ExpenseService, public router: Router) {
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

  visibleSubcategories(category: any) {
    if (!category || !category.subcategories) { return []; }
    return this.showAll ? category.subcategories : category.subcategories.filter((s: any) => !!s.total);
  }

    details(category:string, subCategory:string | null){
      //pass in month, fieldValue, subCategory if present
      //set into filters
      let expFilters = this.service.expenseFilters;
      expFilters.year = this.year;
      expFilters.month = this.month;
      expFilters.category = category;
      expFilters.subcategory = subCategory;
      expFilters.account = null;
      expFilters.payee = null;
      expFilters.showSplits = true;
      this.router.navigate(['/expenseList']);
    }
}
