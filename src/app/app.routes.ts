import { Routes } from '@angular/router';
import { ExpenseListComponent } from './component/expense-list/expense-list.component';
import { ExpenseFormComponent } from './component/expense-form/expense-form.component';
import { PayeeListComponent } from './component/payee-list/payee-list.component';
import { PayeeFormComponent } from './component/payee-form/payee-form.component';
import { CategoryListComponent } from './component/category-list/category-list.component';
import { CategoryFormComponent } from './component/category-form/category-form.component';
import { SubcategoryFormComponent } from './component/subcategory-form/subcategory-form.component';
import { BudgetReportComponent } from './component/budget-report/budget-report.component';
import { AccountFormComponent } from './component/account-form/account-form.component';
import { AccountListComponent } from './component/account-list/account-list.component';
import { FieldReportComponent } from './component/field-report/field-report.component';
import { TestComponent } from './component/test/test.component';
import { RecurringListComponent } from './component/recurring-list/recurring-list.component';
import { RecurringFormComponent } from './component/recurring-form/recurring-form.component';

export const routes: Routes = [

	{ path: '', redirectTo: '/expenseList', pathMatch: 'full' },
	{ path: 'expenseList', component: ExpenseListComponent, title: "Expenses" },
	{ path: 'expenseForm', component: ExpenseFormComponent, title: "Expense Edit" },
	{ path: 'expenseForm/:editId', component: ExpenseFormComponent, title: "Expense Edit" },

	{ path: 'fieldReport', component: FieldReportComponent, title: "Expense Totals" },
	{ path: 'budgetReport', component: BudgetReportComponent, title: "Budget Report" },
	
	{ path: 'accountList', component: AccountListComponent, title: "Accounts" },
	{ path: 'accountForm', component: AccountFormComponent, title: "Account Edit"  },
	{ path: 'accountForm/:editId', component: AccountFormComponent, title: "Account Edit"  },
	{ path: 'payeeList', component: PayeeListComponent, title: "Payees" },
	{ path: 'payeeForm', component: PayeeFormComponent, title: "Payee Edit"  },
	{ path: 'payeeForm/:editId', component: PayeeFormComponent, title: "Payee Edit"  },
	{ path: 'categoryList', component: CategoryListComponent, title: "Categories"  },
	{ path: 'categoryForm', component: CategoryFormComponent, title: "Category Edit"  },
	{ path: 'categoryForm/:editId', component: CategoryFormComponent, title: "Category Edit"  },
	{ path: 'subcategoryForm', component: SubcategoryFormComponent, title: "Subcategory Edit"  },
	{ path: 'subcategoryForm/:editId', component: SubcategoryFormComponent, title: "Subcategory Edit"  },
	{ path: 'recurringList', component: RecurringListComponent, title: "Recurring"  },
	{ path: 'recurringForm', component: RecurringFormComponent, title: "Recurring Edit"  },
	{ path: 'recurringForm/:editId', component: RecurringFormComponent, title: "Recurring Edit"  },

	{ path: 'test', component: TestComponent, title: 'Test Page'}
];
