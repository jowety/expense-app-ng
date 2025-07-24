import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Account } from '../model/account';
import { Payee } from '../model/payee';
import { Category } from '../model/category';
import { Subcategory } from '../model/subcategory';
import { SearchResult } from '../model/search-result';
import { Expense } from '../model/expense';
import { Search } from '../model/search';
import { BudgetReport } from '../model/budget-report';
import { ExpenseFilters } from '../model/expense-filters';
import { FieldReport } from '../model/field-report';
import { Recurring } from '../model/recurring';

@Injectable({
	providedIn: 'root'
})
export class ExpenseService {

	//Service URLs
	//private baseUrl: string = "http://localhost:8080/api/";
	private baseUrl: string = "http://192.168.1.238:8080/api/";
	private accountUrl: string = this.baseUrl + "account";
	private payeeUrl: string = this.baseUrl + "payee";
	private categoryUrl: string = this.baseUrl + "category";
	private subcategoryUrl: string = this.baseUrl + "subcategory";
	private expenseUrl: string = this.baseUrl + "expense";
	private expenseViewUrl: string = this.baseUrl + "expenseview";
	private reportUrl: string = this.baseUrl + "reports";
	private recurringUrl: string = this.baseUrl + "recurring";

	//State management
	expenseFilters:ExpenseFilters = new ExpenseFilters();
	expenseEdit: Expense = new Expense();
	expenseEditCategory: Category | null = null;

	constructor(private http: HttpClient) {
		console.log("ExpenseService constructor");
	 }

	//Expenses 
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
	//Accounts
	public getAccounts(): Observable<Account[]> {
		return this.http.get<Account[]>(this.accountUrl);
	}
	public getAccount(id:string): Observable<Account> {
		return this.http.get<Account>(this.accountUrl + "/" + id);
	}
	public saveNewAccount(account: Account): Observable<Account> {
		return this.http.post<Account>(this.accountUrl, account);
	}
	public updateAccount(account: Account): Observable<Account> {
		return this.http.put<Account>(this.accountUrl, account);
	}
	public deleteAccount(id: string) {
		return this.http.delete(this.accountUrl + "/" + id);
	}
	//Payees
	public getPayees(): Observable<Payee[]> {
		return this.http.get<Payee[]>(this.payeeUrl);
	}
	public getPayee(id: string): Observable<Payee> {
		return this.http.get<Payee>(this.payeeUrl + "/" + id);
	}
	public savePayee(payee: Payee) {
		return this.http.post<Payee>(this.payeeUrl, payee);
	}
	public deletePayee(id: number) {
		return this.http.delete(this.payeeUrl + "/" + id);
	}
	//Categories
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
	//Subcategories
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
	//Recurring
	public getRecurringList(){
		return this.http.get<Recurring[]>(this.recurringUrl);
	}
	public getRecurring(id: string): Observable<Recurring> {
		return this.http.get<Recurring>(this.recurringUrl + "/" + id);
	}
	public saveRecurring(recur: Recurring): Observable<Recurring> {
		return this.http.post<Recurring>(this.recurringUrl, recur);
	}
	public deleteRecurring(id: string) {
		return this.http.delete(this.recurringUrl + "/" + id);
	}
	//Reports
	public getBudgetReport(year: number, month: string) {
		let params = { params: { 'year': year, 'month': month } };
		return this.http.get<BudgetReport>(this.reportUrl + "/budget", params);
	}
	public getFieldReport(year: number, field: string) {
		let params = { params: { 'year': year, 'field': field } };
		return this.http.get<FieldReport>(this.reportUrl + "/field", params);
	}
	public getAvailableYears(){
		return this.http.get<number[]>(this.expenseViewUrl + "/years");
	}
	public getAvailableMonths(year:number){
		return this.http.get<string[]>(this.expenseViewUrl + "/months", { params: { 'year': year } });
	}

	//TESTS
	public test400(){
		this.http.get(this.baseUrl + "test400").subscribe(result => console.log("test400"));
	}
	public test500(){
		this.http.get(this.baseUrl + "test500").subscribe(result => console.log("test500"));
	}
}
