import { Category } from "./category";

export class Subcategory {
    id: string | null = null;
    name: string | null = null;
    category: Category | null = null;
    budget: number | null = null;
    inUse: boolean | null = null;
}
