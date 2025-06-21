import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { ExpenseService } from '../../service/expense.service';
import { Category } from '../../model/category';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-form',
  imports: [SelectModule, FormsModule, ButtonModule, InputTextModule, InputNumber],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  category: Category = new Category();
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService ) {

    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getCategory(this.editId).subscribe(data => {
        this.category = data;
        this.editMode = true;
      })
    }
  }


  onSubmit() {
    if (this.editMode) {
      this.expenseService.updateCategory(this.category).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Category updated`, life: 3000 });
        this.router.navigate(['/categoryList']);
      });
    }
    else {
      this.expenseService.saveNewCategory(this.category).subscribe(result => {
        this.router.navigate(['/categoryList']);
      });
    }
  }
  onCancel() {
    this.router.navigate(['/categoryList']);
  }
}
