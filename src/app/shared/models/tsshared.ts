export class TSShared {

    constructor() {}

    prepareDate(value: string): string {
        const dt = new Date(value);
        return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    }
}
