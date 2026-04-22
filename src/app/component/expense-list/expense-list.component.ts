import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule, TableLazyLoadEvent, Table } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { FilterMetadata } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ExpenseService } from '../../service/expense.service';
import { ExpenseView } from '../../model/expense-view';
import { Expense } from '../../model/expense';
import { Search } from '../../model/search';
import { ExpenseFilters } from '../../model/expense-filters';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [ButtonModule, FloatLabelModule, TableModule, CommonModule, RouterLink, TooltipModule,
    ToastModule, SelectModule, FormsModule, PaginatorModule, ToggleButtonModule, ToggleSwitchModule,
    ImageModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent {
  expenses: ExpenseView[] = [];
  search: Search = new Search();
  payees: string[] = [];
  accounts: string[] = [];
  //account: string | null = null;
  categories: string[] = [];
  //category: string | null = null;
  subcategories: string[] = [];
  //subcategory: string | null = null;
  total = 0;
  years: number[] = [];
  //year: string | null = null;
  months: string[] = [];
  // month: string | null = null;
  totalAmount: number = 0;
  @ViewChild('myTable')
  myTable: Table | undefined;
  monthsLoaded: boolean = false;
 
  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.expenseService.getPayees().subscribe(data => {
      this.payees = data.map(payee => payee.name!);
    });
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data.map(acct => acct.name!);
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data.map(acct => acct.name!);
    });
    this.expenseService.getSubcategories().subscribe(data => {
      this.subcategories = data.map(acct => acct.name!);
    });
    if(!this.getFilters().year) this.getFilters().year = new Date().getFullYear();
    this.getYears();
    this.getMonths();
  }
  getFilters(){
    return this.expenseService.expenseFilters;
  }
  getYears(){
    if(this.expenseService.expenseFilters.closingView){
      this.expenseService.getClosingYears().subscribe(data => {
        this.years = data;
      });
    }
    else{
      this.expenseService.getAvailableYears().subscribe(data => {
        this.years = data;
      });
    }
  }
  getMonths() {
    if(this.expenseService.expenseFilters.year){
      if(this.expenseService.expenseFilters.closingView){
        this.expenseService.getClosingMonths(this.expenseService.expenseFilters.year!).subscribe(data => {
          this.months = data;
        });
      }
      else{
        this.expenseService.getAvailableMonths(this.expenseService.expenseFilters.year!).subscribe(data => {
          this.months = data;   
        });
      }
  }
  }
  closingViewChanged() {
    this.getYears();
    this.getMonths();
    this.makeSearchFilters();
    this.getData();
  }
  yearChanged() {
    this.getMonths();
    this.makeSearchFilters();
    this.getData();
  }
  monthChanged() {
    //this.search.filters = this.search.filters.filter(s => !s.startsWith("monthString"));
    //if (this.expenseService.expenseFilters.month != null) {
    //  this.search.filters.push("monthString equals " + this.expenseService.expenseFilters.month);
    //}
    this.search.firstResult = 0;
    this.makeSearchFilters();
    this.getData();
  }
  pageChange(event: TableLazyLoadEvent | null) {
    let filters = this.expenseService.expenseFilters;
    if (event) {
      filters.first = event.first as number;
      if (event.rows) filters.rows = event.rows as number;
      if (event.sortField) {
        filters.sortField = event.sortField as string;
        filters.sortOrder = event.sortOrder as number;
      }
      else {
        filters.sortField = "date";
        filters.sortOrder = -1;
      }
      if (event.filters) {
        const payeeFilters: FilterMetadata[] = event.filters!['payee'] as FilterMetadata[];
        if (payeeFilters) {
          const payeeFilter: FilterMetadata = payeeFilters[0];
          if (payeeFilter.value) {
            filters.payee = payeeFilter.value;
          }
          else filters['payee'] = null;
        }
        const accountFilters: FilterMetadata[] = event.filters!['account'] as FilterMetadata[];
        if (accountFilters) {
          const accountFilter: FilterMetadata = accountFilters[0];
          if (accountFilter.value) {
            filters.account = accountFilter.value;
          }
          else filters['account'] = null;
        }
        const categoryFilters: FilterMetadata[] = event.filters!['category'] as FilterMetadata[];
        if (categoryFilters) {
          const categoryFilter: FilterMetadata = categoryFilters[0];
          if (categoryFilter.value) {
            filters.category = categoryFilter.value;
          }
          else filters['category'] = null;
        }
        const subcategoryFilters: FilterMetadata[] = event.filters!['subcategory'] as FilterMetadata[];
        if (subcategoryFilters) {
          const subcategoryFilter: FilterMetadata = subcategoryFilters[0];
          if (subcategoryFilter.value) {
            filters.subcategory = subcategoryFilter.value;
          }
          else filters['subcategory'] = null;
        }
        const notesFilters: FilterMetadata[] = event.filters!['notes'] as FilterMetadata[];
        if (notesFilters) {
          const notesFilter = notesFilters[0];
          if (notesFilter.value) {
            filters.notes = notesFilter.value;
          } else {
            filters.notes = null;
          }
        }
      }
    }
    this.makeSearchFilters();
    this.getData();
  }
  clearFilters() {
    this.expenseService.expenseFilters = new ExpenseFilters();
    this.expenseService.expenseFilters.month = null;
    this.search.filters = [];
    this.search.orders = [];
    this.myTable?.reset();
    this.makeSearchFilters();
    this.getData();
  }
  makeSearchFilters() {
    let filters = this.expenseService.expenseFilters;
    this.search.filters = [];
    this.search.orders = [];
    this.search.firstResult = filters.first;
    this.search.maxResults = filters.rows;
    if (filters.sortField) {
      const asc = filters.sortOrder == 1;
      let sortSt = filters.sortField + (asc ? " asc" : " desc");
      this.search.orders.push(sortSt);
    }
    else {
      this.search.orders.push("date desc");
      this.search.orders.push("payee");
    }
    if(this.expenseService.expenseFilters.closingView){
      if(filters.year) this.search.filters.push("closingYear equals " + filters.year);
      if (filters.month) this.search.filters.push("closingMonthString equals " + filters.month);
    }
    else{
      if(filters.year) this.search.filters.push("year equals " + filters.year);
      if (filters.month) this.search.filters.push("monthString equals " + filters.month);
    }
    if (filters.payee) this.search.filters.push(`payee startswith_ci ${filters.payee}`);
    if (filters.account) this.search.filters.push(`account eq ${filters.account}`);
    if (filters.category) this.search.filters.push(`category eq ${filters.category}`);
    if (filters.subcategory) this.search.filters.push(`subcategory eq ${filters.subcategory}`);
    if (filters.notes) this.search.filters.push(`notes contains_ci ${filters.notes}`);
    if(filters.hideFuture){
      //substring on the date returns just the yyyy-mm-dd portion
      //'localDate:' prefix tells the SimpleSearchConverter to convert the string to a LocalDate object
      this.search.filters.push(`date lte localDate:${new Date().toISOString().slice(0,10)}`);
    }
  }
  getData() {
    this.expenseService.getExpenseViews(this.search).subscribe(data => {
      this.expenses = data.results as ExpenseView[];
      this.total = data.totalCount as number;
    });
    this.expenseService.getExpenseViewTotal(this.search).subscribe(data => {
      this.totalAmount = data;
    });
  }
  copy(id:number){
    this.expenseService.getExpense(id.toString()).subscribe(expense => {      
      this.expenseService.expenseEdit = new Expense();
      this.expenseService.expenseEdit.account = expense.account;
      this.expenseService.expenseEdit.payee = expense.payee;
      this.expenseService.expenseEditCategory = expense.subcategory!.category;
      this.expenseService.expenseEdit.subcategory = expense.subcategory;
      this.expenseService.expenseEdit.amount = expense.amount;
      this.expenseService.expenseEdit.notes = expense.notes;
      this.router.navigate(['/expenseForm']);
    })
  }

  confirmDelete(exp: ExpenseView, event: Event) {
    let d = new Date(exp.date as string).toDateString();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete this expense <br/>
      ($${exp.amount} to ${exp.payee} on ${d})?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.expenseService.deleteExpense(exp.id as number).subscribe(data => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Confirmed', 
            detail: `Expense for $${exp.amount} to ${exp.payee} deleted`, 
            life: 3000 });
          this.getData();
        });
      }
    });
  }
}
