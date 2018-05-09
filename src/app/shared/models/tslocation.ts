export class TSLocation {
    id: number;
    uuid: string;
    name: string;
    parentid: string;
    tier: number;
    isdefault: number;
    isgood: number;

    constructor(obj) {
        this.id = obj.id !== undefined ? obj.id : 0;
        this.uuid = obj.uuid !== undefined ? obj.uuid : null;
        this.name = obj.name !== undefined ? obj.name : null;
        this.parentid = obj.parentid !== undefined ? obj.parent_id : null;
        this.tier = obj.tier !== undefined ? obj.tier : null;
        this.isdefault = obj.isdefault !== undefined ? obj.is_default : null;
        this.isgood = obj.isgood !== undefined ? obj.is_good : null;
    }
}
