import { Account } from "./account";
import { Payee } from "./payee";
import { Subcategory } from "./subcategory";

export class Expense {
    id: number | null = null;
    date: Date | string | null = new Date();
    account: Account | null = null;
    payee: Payee | null = null;
    subcategory: Subcategory | null = null;
    amount: number | null = null;
    notes: string | null = null;
    autoInsert: boolean = false;
    estimate: boolean = false;
}
