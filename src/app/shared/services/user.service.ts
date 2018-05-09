import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { BASEURL, httpOptions } from '../../constants';
import { MasterService } from './master.service';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { DataTableParams } from 'angular5-data-table';
import { SharedService } from './shared.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {

    options: HttpHeaders;
    userid: number;

    constructor(
        private httpClient: HttpClient, 
        private masterService: MasterService, 
        private sharedService: SharedService,
        private auth: AuthenticationService
    ) {
        this.options = new HttpHeaders();
        this.options.set('X-Total-Count','0');

        this.userid = this.auth.getUserID();
     }

    getCachedData() {
        return forkJoin([
            this.masterService.getUserRoles()
          ]);
    }

    getUserList(params: DataTableParams, search:string = '', refinedSearch: number = 0): Observable<any> {
        const url = `${BASEURL}/user/list?refined=${refinedSearch}&search=${search}&`+ this.sharedService.paramsToQueryString(params);
        return this.httpClient.get<any>(url, {headers: this.options, observe: 'response'}).pipe(
            map((res:any) => {
                return {
                  items: res.body,
                  itemCount: Number(res.headers.get('X-Total-Count'))
                }
              }),
            catchError(this.masterService.handleError('getUserList', []))
        );
    }

    getUser(id: number): Observable<any> {
        return this.httpClient.get<any>(`${BASEURL}/user/item/${id}`).pipe(
            //tap( user => console.log('User :', user)),
            catchError(this.masterService.handleError<any>('getUser'))
        );
    }

    addUser(user) {
        return this.httpClient.post<any>(`${BASEURL}/user/add/${this.userid}`, user, httpOptions).pipe(
            catchError(this.masterService.handleError<any>(`addUser`))
        );
    }

    blockUser(item:any) {
        return this.httpClient.put<any>(`${BASEURL}/user/block/${this.userid}`, item, httpOptions).pipe(
            catchError(this.masterService.handleError<any>(`blockUser`))
        );
    }
}
