export class MasterItem {
    id: number;
    name: string;
    is_default?: number;
    is_deleted?: number;
    parent_id?: number;
    is_selected?: boolean;
    cpd?: number;

    constructor(obj) {
        this.id = obj.id || 0;
        this.name = obj.name || null;
        this.is_default = obj.is_default || null;
        this.is_deleted = obj.is_deleted || 0;
        this.parent_id = obj.parent_id || null;
        this.cpd = obj.cpd || null;
    }
}
