import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';

import { ExpenseService } from '../../service/expense.service';
import { FieldReport } from '../../model/field-report';
import { ReportFilters } from '../../model/report-filters';

@Component({
  selector: 'app-field-report',
  imports: [TableModule, CommonModule, SelectModule, FormsModule, SelectButtonModule, FloatLabelModule, 
    ToggleSwitchModule, ToggleButtonModule, TooltipModule],
  templateUrl: './field-report.component.html',
  styleUrl: './field-report.component.scss'
})
export class FieldReportComponent {
  report: FieldReport = new FieldReport();
  years: number[] = [];
  fields: string[] = ['Category', 'Payee','Account', 'Credit'];

  constructor(private expenseService: ExpenseService, public router: Router) {
  }
  ngOnInit() {
    this.expenseService.getAvailableYears().subscribe(data => {
      this.years = data;
      if (this.years.length > 0) {
        //years are sorted descending, so first is most current
        this.getFilters().year = this.years[0];
      }
    });
    if(!this.getFilters().year) this.getFilters().year = new Date().getFullYear();
    this.load();
    //alert(JSON.stringify(this.report));
  }


  load() {
    const year = this.getFilters().year;
    if(this.getFilters().field == 'Credit'){
      this.getFilters().showStats = false;
      this.getFilters().monthSortLR = true;
    }
    if (year !== null) {
      this.expenseService.getFieldReport(year, this.getFilters().field.toLowerCase()).subscribe(
        data => this.report = data);
    }
  }
  getFilters(){
    return this.expenseService.reportFilters;
  }
  getReportMonths(){
    let months: string[] = [];
    let current: string[] = [];
    if(this.getFilters().monthSortLR){
        months = this.report.months;
        current = months.slice(months.length-1);
    } 
    else{
      if(this.getFilters().monthsReversed == null){
        this.getFilters().monthsReversed = [...this.report.months].reverse();
      }
      months = this.getFilters().monthsReversed!;
      current = months.slice(0,1);
    }
    if(this.getFilters().showMonths){
      return months;
    }
    else return current;
  }
  getFieldClass(idx: number){
    if(this.getFilters().field === 'Category') return "categoryRow";
    else if(idx % 2 !== 0) return "oddRow";
    else return "";
  }

  details(month:string | null, fieldValue:string, subCategory:string | null){
    //pass in month, fieldValue, subCategory if present
    //set into filters
    let expFilters = this.expenseService.expenseFilters;
    expFilters.year = this.getFilters().year;
    expFilters.month = month;
    if(this.getFilters().field === 'Category'){
      expFilters.category = fieldValue;
      expFilters.subcategory = subCategory;
      expFilters.account = null;
      expFilters.payee = null;
      expFilters.showSplits = true;
      expFilters.closingView = false;
    }       
    else if(this.getFilters().field === 'Account'){ 
      expFilters.account = fieldValue;
      expFilters.category = null;
      expFilters.subcategory = null;
      expFilters.payee = null;
      expFilters.showSplits = false;
      expFilters.closingView = false;
    }
    else if(this.getFilters().field === 'Payee') {
      expFilters.payee = fieldValue;
      expFilters.account = null;
      expFilters.category = null;
      expFilters.subcategory = null;
      expFilters.closingView = false;
      expFilters.showSplits = false;
    }
    else if(this.getFilters().field === 'Credit'){ 
      expFilters.account = fieldValue;
      expFilters.category = null;
      expFilters.subcategory = null;
      expFilters.payee = null;
      expFilters.closingView = true;
      expFilters.showSplits = false;
    }
    this.router.navigate(['/expenseList']);
  }
}
