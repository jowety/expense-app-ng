import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';

import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Util } from '../../model/util';

@Component({
  selector: 'app-account-form',
  imports: [CommonModule, SelectModule, FormsModule, ButtonModule, InputTextModule, DatePickerModule, RouterLink],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent {
  title: string = "New Account";
  account: Account = new Account();
  types: string[] = ["CASH", "CREDIT"];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;
  daysForMonthFreq: number[] = Util.range(1, 28);

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.title = "Edit Account";
      this.expenseService.getAccount(this.editId).subscribe(data => {
        this.account = data;
        this.editMode = true;
      })
    }
  }

  onSubmit() {
    if(this.account.type === 'CREDIT' && !this.account.closes) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: `Closes is required for credit accounts`, life: 3000 });
      return;
    }
    if(this.account.type === 'CASH') {
      this.account.closes = null;
    }
    if (this.editMode) {
      this.expenseService.updateAccount(this.account).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Account updated`, life: 3000 });
        this.router.navigate(['/accountList']);
      });
    }
    else {
      this.expenseService.saveNewAccount(this.account).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: `Account saved`, life: 3000 });
        this.router.navigate(['/accountList']);
      });
    }
  }

}
