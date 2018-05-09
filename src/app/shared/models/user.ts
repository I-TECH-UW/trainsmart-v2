export class User {
    id: number;
    username: string;
    password: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    locale?: string;
    is_blocked?: number;
    county_id?: number;
    ugr_id?: number; // User Group id

    constructor(obj) {
        this.id = obj.id !== undefined ? obj.id : 0;
        this.username = obj.username !== undefined ? obj.username : null;
        this.password = obj.password !== undefined ? obj.password : null;
        this.email = obj.email !== undefined ? obj.email : null;
        this.first_name = obj.first_name !== undefined ? obj.first_name : null;
        this.last_name = obj.last_name !== undefined ? obj.last_name : null;
        this.locale = obj.locale !== undefined ? obj.locale : null;
        this.is_blocked = obj.is_blocked !== undefined ? obj.is_blocked : null;
        this.county_id = obj.county_id !== undefined ? obj.county_id : 0;
        this.ugr_id = obj.ugr_id !== undefined ? obj.ugr_id : 0;
    }
}
