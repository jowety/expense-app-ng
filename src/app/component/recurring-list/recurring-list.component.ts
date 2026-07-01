import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule, TableLazyLoadEvent, Table } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ExpenseService } from '../../service/expense.service';
import { Recurring } from '../../model/recurring';
import { Util } from '../../model/util';
import { RecurringTotals } from '../../model/recurring-totals';

@Component({
  selector: 'app-recurring-list',
  imports: [ButtonModule, FloatLabelModule, TableModule, CommonModule, TooltipModule,
    RouterLink, SelectModule, FormsModule, ToggleButtonModule, ToggleSwitchModule],
  templateUrl: './recurring-list.component.html',
  styleUrl: './recurring-list.component.scss'
})
export class RecurringListComponent {
  recurrings: Recurring[] = [];
  totals: RecurringTotals = new RecurringTotals();
  payees: string[] = [];
  accounts: string[] = [];
  categories: string[] = [];
  subcategories: string[] = [];
  payeeFilter: string | null = null;
  accountFilter: string | null = null;
  categoryFilter: string | null = null;
  subcategoryFilter: string | null = null;

  constructor(private expenseService: ExpenseService, 
    private confirmationService: ConfirmationService, 
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.loadDropdownOptions();
    this.getData();
  }

  loadDropdownOptions() {
    this.expenseService.getRecurringPayees().subscribe(data => {
      this.payees = data.map(payee => payee.name!);
    });
    this.expenseService.getRecurringAccounts().subscribe(data => {
      this.accounts = data.map(account => account.name!);
    });
    this.expenseService.getRecurringCategories().subscribe(data => {
      this.categories = data.map(category => category.name!);
    });
    this.expenseService.getRecurringSubcategories().subscribe(data => {
      this.subcategories = data.map(subcategory => subcategory.name!);
    });
  }

  getData(){
    this.expenseService.getRecurringList().subscribe(data => {
      this.recurrings = data;
      this.recurrings.forEach(recur => {
        recur.freqString = Util.getFreqString(recur);
      });
    })
    this.expenseService.getRecurringTotals().subscribe(data => {
      this.totals = data;
    })
  }

  confirmDelete(exp: Recurring, event: Event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: `Do you want to delete this recurring expense <br/>
        ($${exp.amount} to ${exp.payee?.name} every ${exp.every} ${exp.frequency})?`,
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
          this.expenseService.deleteRecurring(exp.id as number).subscribe(data => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Confirmed', 
              detail: `Recurring Expense for $${exp.amount} to ${exp.payee} deleted`, 
              life: 3000 });
            this.getData();
          });
        }
      });
    }
}
