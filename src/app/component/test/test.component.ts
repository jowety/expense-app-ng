import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ExpenseService } from '../../service/expense.service';

@Component({
  selector: 'app-test',
  imports: [ButtonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  constructor(public expenseService: ExpenseService){}

  test400(){
    this.expenseService.test400();
  }  
  test500(){
    this.expenseService.test500();
  }
}
