import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';

import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-account-form',
  imports: [SelectModule, FormsModule, ButtonModule, InputTextModule, InputNumber, RouterLink],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss'
})
export class AccountFormComponent {
  account: Account = new Account();
  types: string[] = ["CASH", "CREDIT"];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getAccount(this.editId).subscribe(data => {
        this.account = data;
        this.editMode = true;
      })
    }
  }

  onSubmit() {
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
