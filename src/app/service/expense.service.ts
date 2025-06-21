import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Account } from '../model/account';
import { Payee } from '../model/payee';
import { Category } from '../model/category';
import { Subcategory } from '../model/subcategory';
import { SearchResult } from '../model/search-result';
import { Expense } from '../model/expense';
import { ExpenseReport } from '../model/expense-report';
import { Search } from '../model/search';
import { BudgetReport } from '../model/budget-report';
import { ExpenseFilters } from '../model/expense-filters';

@Injectable({
	providedIn: 'root'
})
export class ExpenseService {

	private accountUrl: string = "http://localhost:8080/api/account";
	private payeeUrl: string = "http://localhost:8080/api/payee";
	private categoryUrl: string = "http://localhost:8080/api/category";
	private subcategoryUrl: string = "http://localhost:8080/api/subcategory";
	private expenseUrl: string = "http://localhost:8080/api/expense";
	private expenseViewUrl: string = "http://localhost:8080/api/expenseview";
	private reportUrl: string = "http://localhost:8080/api/reports";

	expenseFilters:ExpenseFilters = new ExpenseFilters();

	constructor(private http: HttpClient) {
		console.log("ExpenseService constructor");
	 }

	public getExpenseViews(search:Search): Observable<SearchResult> {
		return this.http.post<SearchResult>(this.expenseViewUrl + "/search", search);
	}
	public getExpenseViewTotal(search:Search): Observable<number> {
		return this.http.post<number>(this.expenseViewUrl + "/search/total", search);
	}
	public getExpense(id: string): Observable<Expense> {
		return this.http.get<Expense>(this.expenseUrl + "/" + id);
	}
	public saveExpense(expense: Expense): Observable<Expense> {
		return this.http.post<Expense>(this.expenseUrl, expense);
	}
	public deleteExpense(id: number) {
		return this.http.delete(this.expenseUrl + "/" + id);
	}

	public getAccounts(): Observable<Account[]> {
		return this.http.get<Account[]>(this.accountUrl);
	}

	public getPayees(): Observable<Payee[]> {
		return this.http.get<Payee[]>(this.payeeUrl);
	}
	public getPayee(id: string): Observable<Payee> {
		return this.http.get<Payee>(this.payeeUrl + "/" + id);
	}
	public savePayee(payee: Payee) {
		return this.http.post(this.payeeUrl, payee);
	}
	public deletePayee(id: number) {
		return this.http.delete(this.payeeUrl + "/" + id);
	}

	public getCategories(): Observable<Category[]> {
		return this.http.get<Category[]>(this.categoryUrl);
	}
	public getCategory(id: string): Observable<Category> {
		return this.http.get<Category>(this.categoryUrl + "/" + id);
	}
	public saveNewCategory(category: Category): Observable<Category> {
		return this.http.post<Category>(this.categoryUrl, category);
	}
	public updateCategory(category: Category): Observable<Category> {
		return this.http.put<Category>(this.categoryUrl, category);
	}
	public deleteCategory(id: string) {
		return this.http.delete(this.categoryUrl + "/" + id);
	}
	public getSubcategories(categoryId?: string): Observable<Subcategory[]> {
		if(categoryId){
			return this.http.get<Subcategory[]>(this.subcategoryUrl, { params: { 'categoryId': categoryId } });
		}else{
			return this.http.get<Subcategory[]>(this.subcategoryUrl);
		}
	}
	public getSubcategory(id: string): Observable<Subcategory> {
		return this.http.get<Subcategory>(this.subcategoryUrl + "/" + id);
	}
	public saveNewSubcategory(subcategory: Subcategory): Observable<Category> {
		return this.http.post<Subcategory>(this.subcategoryUrl, subcategory);
	}
	public updateSubcategory(subcategory: Subcategory): Observable<Category> {
		return this.http.put<Subcategory>(this.subcategoryUrl, subcategory);
	}
	public deleteSubcategory(id: string) {
		return this.http.delete(this.subcategoryUrl + "/" + id);
	}

	public getExpenseReport(year: number) {
		return this.http.get<ExpenseReport>(this.reportUrl+ "/expense", { params: { 'year': year } });
	}
	public getBudgetReport(year: number, month: string) {
		let params = { params: { 'year': year, 'month': month } };
		return this.http.get<BudgetReport>(this.reportUrl + "/budget", params);
	}
	public getAvailableYears(){
		return this.http.get<string[]>(this.expenseViewUrl + "/years");
	}
	public getAvailableMonths(year:string){
		return this.http.get<string[]>(this.expenseViewUrl + "/months", { params: { 'year': year } });
	}
}
