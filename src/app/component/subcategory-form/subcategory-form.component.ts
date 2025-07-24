import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Params, Router } from '@angular/router';
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
  title: string = "New Subcategory";
  categories: Category[] = [];
  subcategory: Subcategory = new Subcategory();
  private route = inject(ActivatedRoute);
  editId: string | null = null;
  editMode: boolean = false;
  path: string[] = [];
  otherParams: Params = {};

  constructor(private expenseService: ExpenseService, private router: Router, private location: Location,
    private confirmationService: ConfirmationService, private messageService: MessageService) {

    this.editId = this.route.snapshot.paramMap.get('editId');
    if (this.editId) {
      this.title = "Edit Subcategory";
      this.expenseService.getSubcategory(this.editId).subscribe(data => {
        this.subcategory = data;
        this.editMode = true;
      })
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.path = params['path'] || [];
      if (typeof this.path === 'string') {
        this.path = [this.path];
      }
      this.otherParams = { ...params };
      delete this.otherParams['path'];
    });
    this.expenseService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.expenseService.updateSubcategory(this.subcategory).subscribe(result => {
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: `Subcategory updated`, life: 3000 });
      });
    }
    else {
      this.expenseService.saveNewSubcategory(this.subcategory).subscribe(result => {
      });
    }
    this.back();
  }
  forward(route:string){
    this.path.unshift("subcategoryForm");
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
      if(this.subcategory.id) params['subcategoryId'] = this.subcategory.id;
      Object.assign(params, this.otherParams);
      options.queryParams = params;
      this.router.navigate([back], options);
    }
    else this.location.back();
  }
}
