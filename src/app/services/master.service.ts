import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, filter, tap } from 'rxjs/operators';
import { Location } from '../models/location';
import { TrainingCategoryTitleOptions } from '../models/trainingcategorytitleoptions';
import { TrainingOrganizerOptions } from '../models/trainingorganizeroptions';
import { TrainingLevelOptions } from '../models/trainingleveloptions';
import { MasterItem } from '../models/master-item';

const heads = new HttpHeaders();
heads.set('Content-Type', 'application/json');
heads.set('Access-Control-Allow-Origin', '*');

const httpOptions = {
  headers: heads
};

@Injectable()
export class MasterService implements OnInit {

  constructor(private httpClient: HttpClient) {}

   ngOnInit() {}

  getLocation(): Observable<Location[]> {
    return this.getMasterList('location');
  }

  getTrainingCategoryOptions(): Observable<MasterItem[]> {
    return this.getMasterList('trainingcategoryoptions');
  }

  getTrainingCategoryTitleOptions(): Observable<TrainingCategoryTitleOptions[]> {
    return this.getMasterList('trainingcategorytitleoptions');
  }

  getTrainingOrganizerOptions(): Observable<TrainingOrganizerOptions[]> {
    return this.getMasterList('trainingorganizeroptions');
  }

  getTrainingLevelOptions(): Observable<TrainingLevelOptions[]> {
    return this.getMasterList('trainingleveloptions');
  }

  getPepfarCategoryOptions(): Observable<MasterItem[]> {
    return this.getMasterList('pepfarcategoryoptions');
  }

  /**
   * PERSONS
   */
  getPersonEducation(): Observable<MasterItem[]> {
    return this.getMasterList('personeducation');
  }

  getPersonActiveTrainer(): Observable<MasterItem[]> {
    return this.getMasterList('personactivetrainer');
  }

  getPersonAttendReason(): Observable<MasterItem[]> {
    return this.getMasterList('personattendreason');
  }

  getPersonTitle(): Observable<MasterItem[]> {
    return this.getMasterList('persontitle');
  }

  getPersonSuffix(): Observable<MasterItem[]> {
    return this.getMasterList('personsuffix');
  }

  getGender(): Observable<MasterItem[]> {
    return this.getMasterList('gender');
  }

  addTrainingTitle(item: MasterItem): Observable<MasterItem> {
    return this.addMasterItem('trainingtitle', item);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private getMasterList(listref: string): Observable<any[]> {
    const url = `http://localhost:8080/master/${listref}`;
    return this.httpClient.get<any[]>(url)
            .pipe(
              tap(locations => console.log(`fetched ${listref}`)),
              catchError(this.handleError('getMasterList', []))
            )
    ;
  }

  private addMasterItem(itemref: string, item: MasterItem): Observable<MasterItem> {
    return this.httpClient.post<MasterItem>(`http://localhost:8080/master/add/${itemref}/1`, item, httpOptions).pipe(
      tap((obj: MasterItem) => console.log(`Added Item w/ id=${obj.id}`)),
      catchError(this.handleError<MasterItem>(`addTraining`))
    );
  }
}
