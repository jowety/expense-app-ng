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

@Component({
  selector: 'app-recurring-list',
  imports: [ButtonModule, FloatLabelModule, TableModule, CommonModule, TooltipModule,
    RouterLink, SelectModule, FormsModule, ToggleButtonModule, ToggleSwitchModule],
  templateUrl: './recurring-list.component.html',
  styleUrl: './recurring-list.component.scss'
})
export class RecurringListComponent {
  recurrings: Recurring[] = [];

  constructor(private expenseService: ExpenseService) {
  }

  ngOnInit() {
    this.expenseService.getRecurringList().subscribe(data => {
      this.recurrings = data;
    })
  }
  getFreqString(recur: Recurring): string {
    return Util.getFreqString(recur);
  }
}
