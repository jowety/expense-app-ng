import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ExpenseService } from '../../service/expense.service';
import { Account } from '../../model/account';
import { Category } from '../../model/category';
import { Payee } from '../../model/payee';
import { Subcategory } from '../../model/subcategory';

@Component({
  selector: 'app-payee-form',
  imports: [SelectModule, FormsModule, ButtonModule, InputTextModule, RouterLink],
  templateUrl: './payee-form.component.html',
  styleUrl: './payee-form.component.scss'
})
export class PayeeFormComponent {
  payee: Payee = new Payee();
  accounts: Account[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.editMode = true;
      this.expenseService.getPayee(this.editId).subscribe(data => {
        this.payee = data;
        if (this.payee.categoryDefault) {
          this.loadSubs();
        }
      })
    }
  }
  ngOnInit() {
    this.expenseService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  loadSubs() {
    if (this.payee.categoryDefault) {
      this.expenseService.getSubcategories(this.payee.categoryDefault.id!).subscribe(data => {
        this.subcategories = data;
      });
    }
  }

  onSubmit() {
    // alert(JSON.stringify(this.expense));
    this.expenseService.savePayee(this.payee).subscribe(result => {
      let action:string = this.editMode? 'updated': 'created';
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Payee ${this.payee.name} ${action}!`, life: 3000 });
      this.router.navigate(['/payeeList']);
    });
  }
}
