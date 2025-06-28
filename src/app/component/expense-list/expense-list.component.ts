import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
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
import { Search } from '../../model/search';
import { ExpenseFilters } from '../../model/expense-filters';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [ButtonModule, FloatLabelModule, TableModule, CommonModule, RouterLink, TooltipModule,
    ToastModule, SelectModule, FormsModule, PaginatorModule, ToggleButtonModule, ToggleSwitchModule],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent {
  expenses: ExpenseView[] = [];
  search: Search = new Search();
  accounts: string[] = [];
  //account: string | null = null;
  categories: string[] = [];
  //category: string | null = null;
  subcategories: string[] = [];
  //subcategory: string | null = null;
  total = 0;
  years: string[] = [];
  //year: string | null = null;
  months: string[] = [];
  // month: string | null = null;
  totalAmount: number = 0;
  @ViewChild('myTable')
  myTable: Table | undefined;
  defaultRows: number = 25;
  monthsLoaded: boolean = false;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data.map(acct => acct.name!);
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data.map(acct => acct.name!);
    });
    this.expenseService.getSubcategories().subscribe(data => {
      this.subcategories = data.map(acct => acct.name!);
    });
    this.expenseService.getAvailableYears().subscribe(data => {
      this.years = data;
      if (this.years.length > 0) {
        //years are sorted descending, so first is most current
        this.expenseService.expenseFilters['year'] = this.years[0];
        this.getMonths(true);
      }
    });
    this.search.maxResults = this.defaultRows;
    this.search.orders.push("date desc");
    // this.getData();
  }
  getFilters(){
    return this.expenseService.expenseFilters;
  }
  getMonths(setCurrent: boolean) {
    this.expenseService.getAvailableMonths(this.expenseService.expenseFilters.year!).subscribe(data => {
      this.months = data;
      if (this.months.length > 0 && setCurrent) {
        let thisMonth = new Date().toLocaleString('default', { month: 'long' });
        if(this.months.includes(thisMonth)){
          this.expenseService.expenseFilters['month'] = thisMonth;
          this.search.filters.push("monthString equals " + this.expenseService.expenseFilters.month);
        }
      }
      this.monthsLoaded = true;
    })
  }
  yearChanged() {
    this.getMonths(false);
  }
  monthChanged() {
    this.search.filters = this.search.filters.filter(s => !s.startsWith("monthString"));
    if (this.expenseService.expenseFilters.month != null) {
      this.search.filters.push("monthString equals " + this.expenseService.expenseFilters.month);
    }
    this.search.firstResult = 0;
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
    if (filters.month) this.search.filters.push("monthString equals " + filters.month);
    if (filters.payee) this.search.filters.push(`payee startswith_ci ${filters.payee}`);
    if (filters.account) this.search.filters.push(`account eq ${filters.account}`);
    if (filters.category) this.search.filters.push(`category eq ${filters.category}`);
    if (filters.subcategory) this.search.filters.push(`subcategory eq ${filters.subcategory}`);
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
