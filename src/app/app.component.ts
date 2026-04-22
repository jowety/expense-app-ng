import { Component } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { Title } from '@angular/platform-browser';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from './service/expense.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Menubar, TabsModule, ConfirmDialog, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService]
})
export class AppComponent {
  items: MenuItem[] | undefined;

  constructor(private expenseService: ExpenseService, private router: Router, public titleService: Title,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }
    
  ngOnInit() {
    this.items = [
      {label: 'Expenses', routerLink: '/expenseList'},
      {label: 'Totals', routerLink: '/fieldReport'},
      {label: 'Budget', routerLink: '/budgetReport'},
      {label: "Setup", 
        items: [
          {label: 'Accounts', routerLink: '/accountList'},
          {label: 'Categories', routerLink: '/categoryList'},
          {label: 'Payees', routerLink: '/payeeList'},
          {label: 'Recurring', routerLink: '/recurringList'}
        ]
      }
    ]
  }

  getProfile(){
    return this.expenseService.profile;
  }
}
