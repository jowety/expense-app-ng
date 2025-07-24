import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';

import { ExpenseService } from '../../service/expense.service';
import { FieldReport } from '../../model/field-report';

@Component({
  selector: 'app-field-report',
  imports: [TableModule, CommonModule, SelectModule, FormsModule, SelectButtonModule, FloatLabelModule],
  templateUrl: './field-report.component.html',
  styleUrl: './field-report.component.scss'
})
export class FieldReportComponent {
  year: number = new Date().getFullYear();
  report: FieldReport = new FieldReport();
  fields: string[] = ['Category', 'Payee','Account'];
  field: string  = 'Category';

  constructor(private service: ExpenseService) {
  }
  ngOnInit() {
    this.load();
    //alert(JSON.stringify(this.report));
  }


  load() {
    this.service.getFieldReport(this.year, this.field.toLowerCase()).subscribe(data => this.report = data);
  }
}
