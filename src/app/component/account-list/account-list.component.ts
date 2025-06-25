import { Component } from '@angular/core';
import { Account } from '../../model/account';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { ExpenseService } from '../../service/expense.service';

@Component({
  selector: 'app-account-list',
  imports: [TableModule, ToastModule, ButtonModule, RouterLink, TooltipModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent {
  accounts: Account[] = [];
  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

  ngOnInit() {  
    this.getData();
  }
  getData(){  
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }
  
  confirmDelete(id: string, name:string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete the ${name} Account?`,
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
        this.expenseService.deleteAccount(id).subscribe(data => {
          this.getData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Payee ${name} deleted`, life: 3000 });
        });
      }
    });
  }
}
