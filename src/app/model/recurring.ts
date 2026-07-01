import { Account } from "./account";
import { Payee } from "./payee";
import { RecurringSplit } from "./recurring-split";
import { Subcategory } from "./subcategory";

export class Recurring {
    id: number | null = null;
    account: Account | null = null;
    payee: Payee | null = null;
    subcategory: Subcategory | null = null;
    amount: number | null = null;
    amountVaries: boolean = false;
    dateVaries: boolean = false;
    useLastAmount: boolean = false;
    inactive: boolean = false;
    every: number = 1;
    frequency: string = 'MONTHS';
    month: number | null = null;
    day: number = 1;
    insertOption: string = 'MONTH';
    notes: string | null = null;
    startDate: Date | string | null = null;
    splits: RecurringSplit[] = [];
    freqString: string | null = null;
}
