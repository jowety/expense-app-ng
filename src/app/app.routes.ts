import { Routes } from '@angular/router';
import { ExpenseListComponent } from './component/expense-list/expense-list.component';
import { ExpenseFormComponent } from './component/expense-form/expense-form.component';
import { ExpenseReportComponent } from './component/expense-report/expense-report.component';
import { PayeeListComponent } from './component/payee-list/payee-list.component';
import { PayeeFormComponent } from './component/payee-form/payee-form.component';
import { CategoryListComponent } from './component/category-list/category-list.component';
import { CategoryFormComponent } from './component/category-form/category-form.component';
import { SubcategoryFormComponent } from './component/subcategory-form/subcategory-form.component';
import { BudgetReportComponent } from './component/budget-report/budget-report.component';

export const routes: Routes = [

	{ path: '', redirectTo: '/expenseList', pathMatch: 'full' },
	{ path: 'expenseList', component: ExpenseListComponent, title: "Expenses" },
	{ path: 'expenseForm', component: ExpenseFormComponent, title: "Expense Edit" },
	{ path: 'expenseForm/:editId', component: ExpenseFormComponent, title: "Expense Edit" },

	{ path: 'expenseReport', component: ExpenseReportComponent, title: "Monthly Report" },
	{ path: 'budgetReport', component: BudgetReportComponent, title: "Budget Report" },
	
	{ path: 'payeeList', component: PayeeListComponent, title: "Payees" },
	{ path: 'payeeForm', component: PayeeFormComponent, title: "Payee Edit"  },
	{ path: 'payeeForm/:editId', component: PayeeFormComponent, title: "Payee Edit"  },
	{ path: 'categoryList', component: CategoryListComponent, title: "Categories"  },
	{ path: 'categoryForm', component: CategoryFormComponent, title: "Category Edit"  },
	{ path: 'categoryForm/:editId', component: CategoryFormComponent, title: "Category Edit"  },
	{ path: 'subcategoryForm', component: SubcategoryFormComponent, title: "Subcategory Edit"  },
	{ path: 'subcategoryForm/:editId', component: SubcategoryFormComponent, title: "Subcategory Edit"  }
];
