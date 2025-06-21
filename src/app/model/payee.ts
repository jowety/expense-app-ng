import { Account } from "./account";
import { Category } from "./category";
import { Subcategory } from "./subcategory";

export class Payee {
    id: number | null = null;
    name: string | null = null;
    description: string | null = null;
    accountDefault: Account | null = null;
    categoryDefault: Category | null = null;
    subcategoryDefault: Subcategory | null = null;
    inUse: boolean | null = null;
}
