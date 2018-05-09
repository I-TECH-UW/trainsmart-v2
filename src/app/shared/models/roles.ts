export interface Roles {
    sitecoordinator?:boolean;
    countycoordinator?: boolean;
    programmanager?:boolean;
    admin?:boolean;
}

export interface AuthUser {
    uid:string;
    email:string;
    display_name:string;
    roles:Roles;
}