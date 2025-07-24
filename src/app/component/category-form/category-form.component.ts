import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Params, Router, RouterLink } from '@angular/router';
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
  title: string = "New Category";
  path: string[] = [];
  category: Category = new Category();
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;
  otherParams: Params = {};

  constructor(private expenseService: ExpenseService, private router: Router, private location: Location,
    private confirmationService: ConfirmationService, private messageService: MessageService ) {
    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.title = "Edit Category";
      this.expenseService.getCategory(this.editId).subscribe(data => {
        this.category = data;
        this.editMode = true;
      })
    }
  }

  ngOnInit(){
    this.route.queryParams.subscribe((params) => {
      this.path = params['path'] || [];
      if (typeof this.path === 'string') {
        this.path = [this.path];
      }
      this.otherParams = { ...params };
      delete this.otherParams['path'];
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.expenseService.updateCategory(this.category).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Category updated`, life: 3000 });
      });
    }
    else {
      this.expenseService.saveNewCategory(this.category).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: `Category saved`, life: 3000 });
      });
    }
    this.back();
  }

  forward(route:string){
    this.path.unshift("categoryForm");
      const options: NavigationExtras = {};
      const params: Params = {};
      params['path'] = this.path;
      Object.assign(params, this.otherParams);
    this.router.navigate([route], options);
  }
  back(){
    if(this.path.length > 0){
      const back = this.path.shift();
      const options: NavigationExtras = {};
      const params: Params = {};
      params['path'] = this.path;
      if(this.category.id) params['categoryId'] = this.category.id;
      Object.assign(params, this.otherParams);
      options.queryParams = params;
      this.router.navigate([back], options);
    }
    else this.location.back();
  }

}
