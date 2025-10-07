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

import { ExpenseService } from '../../service/expense.service';
import { FieldReport } from '../../model/field-report';

@Component({
  selector: 'app-field-report',
  imports: [TableModule, CommonModule, SelectModule, FormsModule, SelectButtonModule, FloatLabelModule, ToggleSwitchModule, ToggleButtonModule],
  templateUrl: './field-report.component.html',
  styleUrl: './field-report.component.scss'
})
export class FieldReportComponent {
  year: number = new Date().getFullYear();
  report: FieldReport = new FieldReport();
  fields: string[] = ['Category', 'Payee','Account'];
  field: string  = 'Category';
  collapse: boolean = false;
  showMonths: boolean = true;
  showStats: boolean = false;

  constructor(private service: ExpenseService, public router: Router) {
  }
  ngOnInit() {
    this.load();
    //alert(JSON.stringify(this.report));
  }


  load() {
    this.service.getFieldReport(this.year, this.field.toLowerCase()).subscribe(
      data => this.report = data);
  }

  details(month:string, fieldValue:string, subCategory:string | null){
    //pass in month, fieldValue, subCategory if present
    //set into filters
    let filters = this.service.expenseFilters;
    filters.month = month;
    if(this.field === 'Category'){
      filters.category = fieldValue;
      filters.subcategory = subCategory;
      filters.account = null;
      filters.payee = null;
    }       
    else if(this.field === 'Account'){ 
      filters.account = fieldValue;
      filters.category = null;
      filters.subcategory = null;
      filters.payee = null;
    }
    else if(this.field === 'Payee') {
      filters.payee = fieldValue;
      filters.account = null;
      filters.category = null;
      filters.subcategory = null;
    }
    this.router.navigate(['/expenseList']);
  }
}
