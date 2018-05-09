export class PersonList {
    id: number;
    national_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender: string;
    qualification: string;
    facility: string;

    constructor(obj) {
        this.id = obj.id || 0;
        this.national_id = obj.national_id || null;
        this.first_name = obj.first_name || null;
        this.middle_name = obj.middle_name || null;
        this.last_name = obj.last_name || null;
        this.gender = obj.gender || null;
        this.qualification = obj.qualification || null;
        this.facility = obj.facility || null;
    }

    public displayName(): string {
        return `${this.first_name} ${this.middle_name} ${this.last_name}`;
    }
}
