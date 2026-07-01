import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';

import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { Expense } from '../../model/expense';
import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { Payee } from '../../model/payee';
import { Category } from '../../model/category';
import { Subcategory } from '../../model/subcategory';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, InputNumber, InputTextModule, DatePicker, CommonModule, ButtonModule, SelectModule, 
    MessageModule, TooltipModule, ToggleButtonModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent {
  expenseForm!: FormGroup;
  accounts: Account[] = [];
  payees: Payee[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  isSplit: boolean = false;
  title: string = "New Expense";

  constructor(public expenseService: ExpenseService, public router: Router, private messageService: MessageService,
    private fb: FormBuilder) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getExpense(this.editId).subscribe(data => {
        this.title = "Edit Expense";
        this.expenseService.expenseEdit = data;
        this.expenseService.expenseEdit.date = new Date((data.date as string) + "T00:00:00");
        this.loadEditData();
      })
    }
    else if(this.expenseService.expenseEdit) {
      this.loadEditData();
    }    
  }
  loadEditData(){
    let expense = this.expenseService.expenseEdit;
      if(expense.subcategory) {
        this.expenseService.expenseEditCategory = expense.subcategory.category;
        this.loadSubs();
      }
      if(expense.splits && expense.splits.length > 0) {
        this.isSplit = true;
        for (let split of expense.splits) {
          if(split.subcategory?.category) {
            split.category = split.subcategory.category;
            this.expenseService.getSubcategories(split.subcategory!.category.id!).subscribe(data => {
              split.subcategories = data;
            });
          }
        }
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
      if (params['categoryId']) {
        this.expenseService.getCategory(params['categoryId']).subscribe(result => {
          this.expenseService.expenseEditCategory = result;
        })
      }
      if (params['subcategoryId']) {
        this.expenseService.getSubcategory(params['subcategoryId']).subscribe(result => {
          this.expenseService.expenseEdit!.subcategory = result;
        })
      }
    });
  }
  getExpense() {
    return this.expenseService.expenseEdit;
  }
  forward(route:string){
    this.router.navigate([route], {queryParams: {path: "expenseForm"}});
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
    if (this.isSplit && expense.amount! <= 0) {
        this.messageService.add({
          severity: 'danger', summary: 'ERROR!', life:5000,
          detail: `Sum of splits is greater than total!`
        });
        return;
    }    
    if (this.isSplit) {
      for (let split of expense.splits) {
        split.date = expense.date;
        split.account = expense.account;
        split.payee = expense.payee;
      }
    }
    this.expenseService.saveExpense(expense).subscribe(result => {
      this.messageService.add({
        severity: severity, summary: 'Success',
        detail: `Expense for $${expense.amount} to ${expense.payee!.name} ${action}!`
      });
      this.expenseService.expenseEdit = new Expense();
      this.router.navigate(['/expenseList']);
    });
  }
  loadSubs() {
    if (this.expenseService.expenseEditCategory) {
      this.expenseService.getSubcategories(this.expenseService.expenseEditCategory.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }
  loadSplitSubs(index: number) {
    const split = this.getExpense().splits[index];
    if (split?.category?.id) {
      this.expenseService.getSubcategories(split.category.id).subscribe(data => {
        split.subcategories = data;
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
    this.getExpense().parent = true;
    this.getExpense().category = null;
    this.getExpense().subcategory = null;
    this.addSplit();
    this.addSplit();
  }
  removeSplit() {
    this.isSplit = false;
    this.getExpense().category = this.expenseService.expenseEditCategory;
    this.getExpense().parent = false;
    this.getExpense().splits = [];
  }
  // 4. Push a new blank expense into your split array
  addSplit() {
    const newSplit = new Expense();
    newSplit.amount = 0;
    newSplit.date = this.getExpense().date;
    newSplit.account = this.getExpense().account;
    newSplit.payee = this.getExpense().payee;
    newSplit.category = this.expenseService.expenseEditCategory;
    if(newSplit.category) {
      this.expenseService.getSubcategories(newSplit.category.id!).subscribe(data => {
        newSplit.subcategories = data;
      });
    }
    newSplit.parent = false;
    this.getExpense().splits.push(newSplit);
    this.updateRemain();
  }
  // 5. Delete a specific split row from the middle
  deleteSplit(index: number) {
    this.getExpense().splits.splice(index, 1);
    if (this.getExpense().splits.length < 2) {
      this.removeSplit(); // Fallback if they delete down to nothing
    } else {
      this.updateRemain();
    }
  }
  updateRemain() {
    if (this.getExpense().amount) {
      let runningSumOfOthers = 0;
      
      // Sum up the amounts of Split 2, Split 3, Split 4, etc.
      for (let i = 1; i < this.getExpense().splits.length; i++) {
        runningSumOfOthers += this.getExpense().splits[i].amount || 0;
      }
      
      // Split 1 absorbs the remainder (Total - everything else)
      if (this.getExpense().splits.length > 0) {
        this.getExpense().splits[0].amount = Number((this.getExpense().amount! - runningSumOfOthers).toFixed(2));
      }      
    }
  }
  check() {
    console.log("Expense: " + JSON.stringify(this.getExpense()));
    console.log("Splits: " + JSON.stringify(this.getExpense().splits));
  }
}
