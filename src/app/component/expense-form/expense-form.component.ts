import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  imports: [FormsModule, InputNumber, InputTextModule, DatePicker, CommonModule, ButtonModule, SelectModule, MessageModule, RouterLink],
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
  total: number | null = null;

  constructor(private expenseService: ExpenseService, private router: Router, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getExpense(this.editId).subscribe(data => {
        this.expense = data;
        this.expense.date = new Date((data.date as string) + "T00:00:00");
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
  toDateString(d:Date): string{
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()}`;
  }
  onSubmit() {
    this.expense.date = (this.expense.date as Date).toISOString().slice(0, 10);
    if (!this.isSplit) {
      this.expenseService.saveExpense(this.expense).subscribe(result => {
        this.messageService.add({
          severity: 'success', summary: 'Success',
          detail: `Expense for $${this.expense.amount} to ${this.expense.payee!.name} saved!`
        });
        this.router.navigate(['/expenseList']);
      });
    }
    else {
      if (this.expense.amount! <= 0) {
        this.messageService.add({
          severity: 'danger', summary: 'ERROR!',
          detail: `Sum of splits is greater than total!`
        });
      }
      else {
        this.expenseService.saveExpense(this.expense).subscribe(result => {
          this.messageService.add({
            severity: 'success', summary: 'Success',
            detail: `Expense for $${this.expense.amount} to ${this.expense.payee!.name} saved!`
          });
        });
        for (let split of this.splits) {
          let exp: Expense = new Expense();
          exp.account = this.expense.account;
          exp.date = this.expense.date;
          exp.payee = this.expense.payee;
          exp.subcategory = split.subcategory;
          exp.amount = split.amount;
          exp.notes = split.notes;
          this.expenseService.saveExpense(exp).subscribe(result => {
            this.messageService.add({
              severity: 'success', summary: 'Success',
              detail: `Expense for $${exp.amount} to ${exp.payee!.name} saved!`
            });
          });
        }
        this.router.navigate(['/expenseList']);
      }
    }
  }
  loadSubs() {
    if (this.category) {
      this.expenseService.getSubcategories(this.category.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }
  loadSplitSubs(index: number) {
    if (this.splits[index].category) {
      this.expenseService.getSubcategories(this.splits[index].category.id!).subscribe(data => {
        this.splits[index].subcategories = data;
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
  enableSplit() {
    this.isSplit = true;
    this.splits.push(new Split());
    this.total = this.expense.amount;
  }
  removeSplit() {
    this.isSplit = false;
    this.splits = [];
    this.expense.amount = this.total;
  }
  updateRemain() {
    if (this.total) {
      this.expense.amount = this.total;
      for (let split of this.splits) {
        if (split.amount) this.expense.amount! -= split.amount;
      }
    }
  }
  check() {
    console.log("Expense: " + JSON.stringify(this.expense));
    console.log("Splits: " + JSON.stringify(this.splits));
  }
}
