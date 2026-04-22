export class Account {
    id: string | null = null;
    name: string | null = null;
    type: string | null = null;
    inUse: boolean | null = null;
    excluded: boolean = false;
    closes: number | null = null;
    due: number | null = null;
}
