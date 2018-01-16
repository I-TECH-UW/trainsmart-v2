export class PersonList {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: string;
    qualification: string;

    constructor(obj) {
        this.id = obj.id || 0;
        this.first_name = obj.first_name || null;
        this.middle_name = obj.middle_name || null;
        this.last_name = obj.last_name || null;
        this.gender = obj.gender || null;
        this.qualification = obj.qualification || null;
    }

    public displayName(): string {
        return `${this.first_name} ${this.middle_name} ${this.last_name}`;
    }
}
