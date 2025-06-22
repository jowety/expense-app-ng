import { Category } from "./category";
import { Subcategory } from "./subcategory";

export class Split {
    category: Category | null = null;
    subcategories: Subcategory[] = [];
    subcategory: Subcategory | null = null;
    amount: number | null = null;
    notes: string | null = null;
}
