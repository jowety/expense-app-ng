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
import { MessageService } from 'primeng/api';

import { Expense } from '../../model/expense';
import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { Payee } from '../../model/payee';
import { Category } from '../../model/category';
import { Subcategory } from '../../model/subcategory';
import { Split } from '../../model/split';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, InputNumber, InputTextModule, DatePicker, CommonModule, ButtonModule, SelectModule, MessageModule, RouterLink],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent {
  accounts: Account[] = [];
  payees: Payee[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  isSplit: boolean = false;
  splits: Split[] = [];
  total: number | null = null;

  constructor(public expenseService: ExpenseService, public router: Router, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getExpense(this.editId).subscribe(data => {
        this.expenseService.expenseEdit = data;
        this.expenseService.expenseEdit.date = new Date((data.date as string) + "T00:00:00");
        this.expenseService.expenseEditCategory = this.expenseService.expenseEdit.subcategory!.category;
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
    this.loadSubs();
    this.route.queryParams.subscribe((params) => {
      if (params['payeeId']) {
        this.expenseService.getPayee(params['payeeId']).subscribe(result => {
          this.expenseService.expenseEdit!.payee = result;
          this.loadPayeeDefaults();
        })
      }
    });
  }
  getExpense() {
    return this.expenseService.expenseEdit;
  }
  cancel() {
    this.expenseService.expenseEdit = new Expense();
    this.router.navigate(['/expenseList']);
  }
  onSubmit() {
    let expense = this.expenseService.expenseEdit!;
    expense.date = (expense.date as Date).toISOString().slice(0, 10);
      let action:string = expense.id? 'updated': 'saved';
      let severity:string = expense.id? 'info': 'success';
    if (!this.isSplit) {
      this.expenseService.saveExpense(expense).subscribe(result => {
        this.messageService.add({
          severity: severity, summary: 'Success',
          detail: `Expense for $${expense.amount} to ${expense.payee!.name} ${action}!`
        });
        this.expenseService.expenseEdit = new Expense();
        this.router.navigate(['/expenseList']);
      });
    }
    else {
      if (expense.amount! <= 0) {
        this.messageService.add({
          severity: 'danger', summary: 'ERROR!', life:5000,
          detail: `Sum of splits is greater than total!`
        });
      }
      else {
        this.expenseService.saveExpense(expense).subscribe(result => {
          this.messageService.add({
            severity: 'success', summary: 'Success', life:5000,
            detail: `Expense for $${expense.amount} to ${expense.payee!.name} ${action}!`
          });
        });
        for (let split of this.splits) {
          let exp: Expense = new Expense();
          exp.account = expense.account;
          exp.date = expense.date;
          exp.payee = expense.payee;
          exp.subcategory = split.subcategory;
          exp.amount = split.amount;
          exp.notes = split.notes;
          this.expenseService.saveExpense(exp).subscribe(result => {
            this.messageService.add({
              severity: 'success', summary: 'Success', life:5000,
              detail: `Expense for $${exp.amount} to ${exp.payee!.name} saved!`
            });
          });
        }
        this.expenseService.expenseEdit = new Expense();
        this.router.navigate(['/expenseList']);
      }
    }
  }
  loadSubs() {
    if (this.expenseService.expenseEditCategory) {
      this.expenseService.getSubcategories(this.expenseService.expenseEditCategory.id!).subscribe(data => {
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
    let expense = this.expenseService.expenseEdit!;
    if (expense.payee) {
      expense.account = expense.payee.accountDefault;
      this.expenseService.expenseEditCategory = expense.payee.categoryDefault;
      this.loadSubs();
      expense.subcategory = expense.payee.subcategoryDefault;
    }
  }
  enableSplit() {
    this.isSplit = true;
    this.splits.push(new Split());
    this.total = this.expenseService.expenseEdit!.amount;
  }
  removeSplit() {
    this.isSplit = false;
    this.splits = [];
    this.expenseService.expenseEdit!.amount = this.total;
  }
  updateRemain() {
    if (this.total) {
      this.expenseService.expenseEdit!.amount = this.total;
      for (let split of this.splits) {
        if (split.amount) this.expenseService.expenseEdit!.amount! -= split.amount;
      }
    }
  }
  check() {
    console.log("Expense: " + JSON.stringify(this.expenseService.expenseEdit!));
    console.log("Splits: " + JSON.stringify(this.splits));
  }
}
