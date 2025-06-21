import { Expense } from "./expense";

export class SearchResult {
    results: object[] = [];
    resultType: string | null = null;
    firstResult: number | null = null;
    pageSize: number | null = null;
    totalCount: number | null = null;
}
