import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

import { Expense } from '../../model/expense';
import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { Payee } from '../../model/payee';
import { Category } from '../../model/category';
import { Subcategory } from '../../model/subcategory';
import { Split } from '../../model/split';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, InputNumber, InputTextModule, DatePicker, CommonModule, ButtonModule, SelectModule, MessageModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent {
  expense: Expense = new Expense();
  accounts: Account[] = [];
  payees: Payee[] = [];
  categories: Category[] = [];
  category: Category | null = null;
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  isSplit: boolean = false;
  splits: Split[] = [];

  constructor(private expenseService: ExpenseService, private router: Router, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getExpense(this.editId).subscribe(data => {
        this.expense = data;
        this.expense.date = new Date(data.date as string);
        this.category = this.expense.subcategory!.category;
        this.loadSubs();
      })
    }
  }
  ngOnInit() {
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.expenseService.getPayees().subscribe(data => {
      this.payees = data;
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  onSubmit() {
    // alert(JSON.stringify(this.expense));
    this.expenseService.saveExpense(this.expense).subscribe(result => {
      this.messageService.add({
        severity: 'success', summary: 'Success',
        detail: `Expense for $${this.expense.amount} to ${this.expense.payee!.name} saved!`
      });
      this.router.navigate(['/expenseList']);
    });
  }
  onCancel() {
    this.router.navigate(['/expenseList']);
  }
  loadSubs() {
    if (this.category) {
      this.expenseService.getSubcategories(this.category.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }
  loadPayeeDefaults() {
    if (this.expense.payee) {
      this.expense.account = this.expense.payee.accountDefault;
      this.category = this.expense.payee.categoryDefault;
      this.loadSubs();
      this.expense.subcategory = this.expense.payee.subcategoryDefault;
    }
  }

}
