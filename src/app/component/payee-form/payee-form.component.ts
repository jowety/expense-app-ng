import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Params, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { Category } from '../../model/category';
import { Payee } from '../../model/payee';
import { Subcategory } from '../../model/subcategory';

@Component({
  selector: 'app-payee-form',
  imports: [SelectModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './payee-form.component.html',
  styleUrl: './payee-form.component.scss'
})
export class PayeeFormComponent {
  payee: Payee = new Payee();
  accounts: Account[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;
  path: string[] = [];
  otherParams: Params = {};
  title: string = "New Payee";

  constructor(private expenseService: ExpenseService, private router: Router, private location: Location,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.title = "Edit Payee";
      this.editMode = true;
      this.expenseService.getPayee(this.editId).subscribe(data => {
        this.payee = data;
        if (this.payee.categoryDefault) {
          this.loadSubs();
        }
      })
    }
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.path = params['path'] || [];
      if (typeof this.path === 'string') {
        this.path = [this.path];
      }
      this.otherParams = { ...params };
      delete this.otherParams['path'];
    });
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  loadSubs() {
    if (this.payee.categoryDefault) {
      this.expenseService.getSubcategories(this.payee.categoryDefault.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }

  onSubmit() {
    // alert(JSON.stringify(this.expense));
    this.expenseService.savePayee(this.payee).subscribe(result => {
      this.payee = result;
      let action:string = this.editMode? 'updated': 'created';
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Payee ${this.payee.name} ${action}!`, life: 3000 });
      this.back();
    });
  }

  forward(route:string){
    this.path.unshift("payeeForm");
      const options: NavigationExtras = {};
      const params: Params = {};
      params['path'] = this.path;
      Object.assign(params, this.otherParams);
    this.router.navigate([route], options);
  }

  back(){
    if(this.path.length > 0){
      const back = this.path.shift();
      const options: NavigationExtras = {};
      const params: Params = {};
      params['path'] = this.path;
      if(this.payee.id) params['payeeId'] = this.payee.id;
      Object.assign(params, this.otherParams);
      options.queryParams = params;
      this.router.navigate([back], options);
    }
    else this.location.back();
  }
}
