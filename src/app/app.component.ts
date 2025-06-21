import { Component } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ExpenseService } from './service/expense.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Menubar, TabsModule, CommonModule, ConfirmDialog, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {
  title = 'Expense Manager';
  items: MenuItem[] | undefined;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }
    
  ngOnInit() {
    this.items = [
      {label: 'Expenses', routerLink: '/expenseList'},
      {label: 'Reports', 
        items:[
          {label: 'Monthly', routerLink: '/expenseReport'},
          {label: 'Budget', routerLink: '/budgetReport'}
        ]},
      {label: "Setup", 
        items: [
          {label: 'Categories', routerLink: '/categoryList'},
          {label: 'Payees', routerLink: '/payeeList'}
        ]
      }
    ]
  }
}
