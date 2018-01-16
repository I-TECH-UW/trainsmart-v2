export class User {
    id: number;
    username: string;
    password: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    locale?: string;
    countyid?: number;
    groupid?: number;

    constructor(obj) {
        this.id = obj.id !== undefined ? obj.id : 0;
        this.username = obj.username !== undefined ? obj.username : null;
        this.password = obj.password !== undefined ? obj.password : null;
        this.email = obj.email !== undefined ? obj.email : null;
        this.firstname = obj.firstname !== undefined ? obj.firstname : null;
        this.lastname = obj.lastname !== undefined ? obj.lastname : null;
        this.locale = obj.locale !== undefined ? obj.locale : null;
        this.countyid = obj.countyid !== undefined ? obj.countyid : 0;
        this.groupid = obj.groupid !== undefined ? obj.groupid : 0;
    }
}