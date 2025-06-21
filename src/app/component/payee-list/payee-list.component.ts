import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule} from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { ExpenseService } from '../../service/expense.service';
import { Payee } from '../../model/payee';

@Component({
  selector: 'app-payee-list',
  imports: [TableModule, ToastModule, ButtonModule, RouterLink, TooltipModule],
  templateUrl: './payee-list.component.html',
  styleUrl: './payee-list.component.scss'
})
export class PayeeListComponent {
  payees: Payee[] = [];

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadData();
  }
  loadData(){
    this.expenseService.getPayees().subscribe(data => {
      this.payees = data;
    });
  }
  newPayee() {
    this.router.navigate(['/payeeForm'])
  }
  confirmDelete(id: number, name:string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete the ${name} Payee?`,
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
        this.expenseService.deletePayee(id).subscribe(data => {
          this.loadData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Payee ${name} deleted`, life: 3000 });
        });
      }
    });
  }
}
