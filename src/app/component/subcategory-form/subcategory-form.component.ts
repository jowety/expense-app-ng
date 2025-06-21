import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ExpenseService } from '../../service/expense.service';
import { Category } from '../../model/category';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subcategory } from '../../model/subcategory';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-subcategory-form',
  imports: [SelectModule, FormsModule, ButtonModule, InputTextModule, InputNumber],
  templateUrl: './subcategory-form.component.html',
  styleUrl: './subcategory-form.component.scss'
})
export class SubcategoryFormComponent {
  categories: Category[] = [];
  subcategory: Subcategory = new Subcategory();
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;

  constructor(private expenseService: ExpenseService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) {

    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.expenseService.getSubcategory(this.editId).subscribe(data => {
        this.subcategory = data;
        this.editMode = true;
      })
    }
  }

  ngOnInit() {
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.expenseService.updateSubcategory(this.subcategory).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Subcategory updated`, life: 3000 });
        this.router.navigate(['/categoryList']);
      });
    }
    else {
      this.expenseService.saveNewSubcategory(this.subcategory).subscribe(result => {
        this.router.navigate(['/categoryList']);
      });
    }
  }
  onCancel() {
    this.router.navigate(['/categoryList']);
  }
}
