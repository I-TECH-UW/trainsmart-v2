import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { MasterService } from './master.service';
import { BASEURL, httpOptions } from '../../constants';
import { Person } from '../models/person';
import { DataTableParams } from 'angular5-data-table';
import { SharedService } from './shared.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class PersonService {

  userid:number;

  constructor(private httpClient: HttpClient, private masterService: MasterService,
    private sharedService:SharedService, private auth:AuthenticationService) {
      this.userid = this.auth.getUserID();
     }

  getCachedData() {
    return forkJoin([
      this.masterService.getPersonTitle(),
      this.masterService.getPersonSuffix(),
      this.masterService.getGender(),
      this.masterService.getPersonQualification(),
      this.masterService.getPersonPrimaryResponsibility(),
      this.masterService.getPersonSecondaryResponsibility(),
      this.masterService.getPersonAttendReason()
    ]);
  }

  queryList(params: DataTableParams, search:string = ''): Observable<any> {
    const url = `${BASEURL}/person/testlist?search=${search}&`+ this.sharedService.paramsToQueryString(params);
    let options = new HttpHeaders();
    options.set('X-Total-Count','0');
    return this.httpClient.get<any>(url,{headers: options, observe: 'response'}).pipe(
      map((res:any) => {
        return {
          items: res.body,
          itemCount: Number(res.headers.get('X-Total-Count'))
        }
      })
    );
  }

  getPersonList(pagenumber: number, pagesize: number): Observable<{total: number, items: any}> {
    const url = `${BASEURL}/person/list/${pagenumber}/${pagesize}`;
    let options = new HttpHeaders();
    options.set('X-Total-Count','0');
    options.set('X-Pagination-Total-Count','0');
    options.set('X-Pagination-Page-Count','0');
    options.set('X-Pagination-Current-Page','0');
    options.set('X-Pagination-Per-Page','0');
    options.set('sort','-name');
    return this.httpClient.get<any>(url,{headers: options, observe: 'response'}).pipe(
      map((res:any) => {
        //console.log('Headers', res.headers.get('X-Total-Count'));//X-Custom-Header
        //console.log(res.body);
        return res.body;
      }),
      //tap(trainings => console.log(`fetched person list`)),
      catchError(this.masterService.handleError('getPersonList', []))
    );
  }

  getMFL(search: string): Observable<any> {
    const url = `${BASEURL}/person/mfl/${search}`;
    return this.httpClient.get<any>(url).pipe(
      //tap(trainings => console.log(`fetched mfl list`)),
      catchError(this.masterService.handleError('getMFL', []))
    );
  }

  checkPersonExists(national_id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${BASEURL}/person/exists/${national_id}`).pipe(
      //tap(training => console.log(`Check person exists national id ${national_id}`)),
      catchError(this.masterService.handleError<boolean>('checkPersonExists'))
    );
  }

  addPerson(person: Person): Observable<Person> {
    return this.httpClient.post<Person>(`${BASEURL}/person/add/${this.userid}`, person, httpOptions).pipe(
      //tap((obj: Person) => console.log(`Added Person w/ id=${obj.id}`)),
      catchError(this.masterService.handleError<Person>(`addPerson`))
    );
  }

  getPerson(id: number): Observable<Person> {
    return this.httpClient.get<Person>(`${BASEURL}/person/item/${id}`).pipe(
      //tap(training => console.log(`Fetched person id ${id}`)),
      catchError(this.masterService.handleError<Person>('getPerson'))
    );
  }

  getPersonTrainings(id: number): Observable<any> {
    return this.httpClient.get<any>(`${BASEURL}/person/trainings/${id}`).pipe(
      //tap(trainings => console.log(`Fetched trainings for person id ${id}`)),
      catchError(this.masterService.handleError<any>('getPersonTrainings'))
    );
  }

  deletePerson(id: number): Observable<any> {
    const url = `${BASEURL}/person/del/${this.userid}`;
    const test = {id: id} as Person;
    return this.httpClient.put(url, test, httpOptions).pipe(
      //tap(_ => console.log(`Deleted person id: ${id}`)),
      catchError(this.masterService.handleError('deletePersonList'))
    );
  }
}
