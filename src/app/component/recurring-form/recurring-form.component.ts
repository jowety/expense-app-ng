import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';

import { ExpenseService } from '../../service/expense.service';
import { Recurring } from '../../model/recurring';
import { Account } from '../../model/account';
import { Payee } from '../../model/payee';
import { Category } from '../../model/category';
import { Subcategory } from '../../model/subcategory';
import { Util } from '../../model/util';

@Component({
  selector: 'app-recurring-form',
  imports: [FormsModule, InputNumber, InputTextModule, ToggleButtonModule, CommonModule, ButtonModule, SelectModule, MessageModule, RouterLink, TooltipModule],
  templateUrl: './recurring-form.component.html',
  styleUrl: './recurring-form.component.scss'
})
export class RecurringFormComponent {
  title:string = "New Recurring Expense";
  path: string[] = [];
  recur: Recurring = new Recurring();
  accounts: Account[] = [];
  payees: Payee[] = [];
  category: Category | null = null;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  everys: number[] = Util.range(1, 6);
  daysForMonthFreq: number[] = Util.range(1, 28);
  daysForYearFreq: number[] = [];
  frequencies: string[] = ['MONTHS', 'YEARS', 'WEEKS'];
  insertOptions1:{value:string, display:string}[] = [
    {value:'MONTH', display:'Month start'}, {value:'DAY', display:'On the day'}
  ]
  insertOptions2:{value:string, display:string}[] = [
    {value:'WEEK', display:'Week start'}, {value:'DAY', display:'On the day'}
  ]


  constructor(public expenseService: ExpenseService, public router: Router, private messageService: MessageService,
    private location: Location
  ) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.title = "Edit Recurring Expense";
      this.expenseService.getRecurring(this.editId).subscribe(data => {
        this.recur = data;
        this.category = this.recur.subcategory!.category;
        this.loadSubs();
      })
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.path = params['path'] || [];
      if (typeof this.path === 'string') {
        this.path = [this.path];
      }
      if (params['payeeId']) {
        this.expenseService.getPayee(params['payeeId']).subscribe(result => {
          this.recur.payee = result;
          this.loadPayeeDefaults();
        })
      }
      if (params['categoryId']) {
        this.expenseService.getCategory(params['categoryId']).subscribe(result => {
          this.category = result;
        })
      }
      if (params['subcategoryId']) {
        this.expenseService.getSubcategory(params['subcategoryId']).subscribe(result => {
          this.recur.subcategory = result;
        })
      }
    });
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.expenseService.getPayees().subscribe(data => {
      this.payees = data;
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
    this.loadSubs();
  }

  loadSubs() {
    if (this.category) {
      this.expenseService.getSubcategories(this.category.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }

  loadPayeeDefaults() {
    if (this.recur.payee) {
      this.recur.account = this.recur.payee.accountDefault;
      this.category = this.recur.payee.categoryDefault;
      this.loadSubs();
      this.recur.subcategory = this.recur.payee.subcategoryDefault;
    }
  }

  onSubmit() {
    this.expenseService.saveRecurring(this.recur).subscribe(result => {
      this.messageService.add({
        severity: "success", summary: 'Success',
        detail: `Recurring Expense for $${this.recur.amount} to ${this.recur.payee!.name} saved!`
      });
      this.router.navigate(['/recurringList']);
    });
  }
  forward(route:string){
    this.path.unshift("recurringForm");
    this.router.navigate([route], {queryParams: {path: this.path}});
  }
  back(){
    if(this.path.length > 0){
      const back = this.path.shift();
      const options: NavigationExtras = {};
      const params: { [key: string]: any } = {};
      params['path'] = this.path;
      if(this.recur.id) params['recurringId'] = this.recur.id;
      options.queryParams = params;
      this.router.navigate([back], options);
    }
    else this.location.back();
  }

  getMonthSelects() {
    return Util.months;
  }
  getWeekdaySelects() {
    return Util.weekdays;
  }
  updateMonthDaysSelects() {
    if (this.recur.month) this.daysForYearFreq = Util.range(1, Util.monthDaysMap[this.recur.month]);
  }
  getInsertOptions(){
    if(this.recur.frequency){
      if(this.recur.frequency == "WEEKS"){
        return this.insertOptions2;
      }
      else return this.insertOptions1;
    }
    else return [];
  }
  
  check() {
    console.log("Recurring: " + JSON.stringify(this.recur!));
  }
}
