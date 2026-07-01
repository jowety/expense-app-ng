import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputNumber } from 'primeng/inputnumber';

import { ExpenseService } from '../../service/expense.service';
import { Category } from '../../model/category';
import { Subcategory } from '../../model/subcategory';

@Component({
  selector: 'app-category-list',
  imports: [ButtonModule, RouterLink, TooltipModule, ToastModule, CommonModule, FormsModule, InputNumber],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
  categories: Category[] = [];
  subCategoryMap: { [key: string]: Subcategory[] } = {};
  monthlyBudgetTotal: number | null = null;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

  ngOnInit() {  
    this.getData();
    this.loadMonthlyBudgetTotal();
  }

  loadMonthlyBudgetTotal() {
    this.expenseService.getMonthlyBudgetTotal().subscribe(data => {
      this.monthlyBudgetTotal = data ?? 0;
    });
  }

  updateMonthlyBudgetTotal() {
    if (this.monthlyBudgetTotal === null || isNaN(this.monthlyBudgetTotal) || this.monthlyBudgetTotal < 0) {
      this.messageService.add({ severity: 'error', summary: 'Validation', detail: 'Please enter a valid monthly budget total.', life: 3000 });
      return;
    }

    this.expenseService.saveMonthlyBudgetTotal(this.monthlyBudgetTotal).subscribe(result => {
      if (typeof result === 'number' && !isNaN(result)) {
        this.monthlyBudgetTotal = result;
      }
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Monthly budget total updated.', life: 3000 });
    });
  }

  getData(){  
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
      for(let cat of this.categories){
        this.expenseService.getSubcategories(cat.id!).subscribe(data => {
          this.subCategoryMap[cat.id!] = data;
        });
      }
    });
  }

  confirmDeleteCategory(id: string, name:string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete the ${name} Category?`,
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
        this.expenseService.deleteCategory(id).subscribe(data => {
          this.getData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${name} deleted`, life: 3000 });
        });
      }
    });
  }
  
  confirmDeleteSubcategory(id: string, name:string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete the ${name} Subcategory?`,
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
        this.expenseService.deleteSubcategory(id).subscribe(data => {
          this.getData();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Subcategory ${name} deleted`, life: 3000 });
        });
      }
    });
  }
}
