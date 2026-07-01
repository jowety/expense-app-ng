import { Subcategory } from "./subcategory";
import { Category } from "./category";

export class RecurringSplit {
    
    id: number | null = null;
    subcategory: Subcategory | null = null;
    amount: number | null = null;
    notes: string | null = null;
    //transient
    category: Category | null = null;
    subcategories: Subcategory[] = [];
}
