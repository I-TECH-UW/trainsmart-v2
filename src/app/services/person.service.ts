import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { MasterService } from './master.service';
import { BASEURL, httpOptions } from '../constants';
import { Person } from '../models/person';

@Injectable()
export class PersonService {

  constructor(private httpClient: HttpClient, private masterService: MasterService) { }

  getCachedData() {
    return forkJoin([
      this.masterService.getPersonTitle(),
      this.masterService.getPersonSuffix(),
      this.masterService.getGender()
    ]);
  }

  getPersonList(pagenumber: number, pagesize: number): Observable<{total: number, items: any}> {
    const url = `${BASEURL}/person/list/${pagenumber}/${pagesize}`;
    return this.httpClient.get<any>(url).pipe(
      tap(trainings => console.log(`fetched person list`)),
      catchError(this.masterService.handleError('getPersonList', []))
    );
  }

  deletePerson(id: number): Observable<any> {
    const userid = 1;
    const url = `http://localhost:8080/person/del/${userid}`;
    const test = {id: id} as Person;
    return this.httpClient.put(url, test, httpOptions).pipe(
      tap(_ => console.log(`Deleted person id: ${id}`)),
      catchError(this.masterService.handleError('deletePersonList'))
    );
  }
}
