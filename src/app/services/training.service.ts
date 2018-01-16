import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { Location } from '../models/location';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MasterService } from './master.service';
import { Training } from '../models/training.interface';
import { httpOptions } from '../constants';

@Injectable()
export class TrainingService {
  baseRef: string;
  // locations: Location[];

  constructor(private httpClient: HttpClient, private masterService: MasterService) { }

  /**
   * @returns an array of objects in order of
   *    Location,
   *    TrainingCategoryOptions,
   *    TrainingCategoryTitleOptions
   */
  getCachedData() {
    return forkJoin([
      this.masterService.getLocation(),
      this.masterService.getTrainingCategoryOptions(),
      this.masterService.getTrainingCategoryTitleOptions(),
      this.masterService.getTrainingOrganizerOptions(),
      this.masterService.getTrainingLevelOptions(),
      this.masterService.getPepfarCategoryOptions()
    ]);
  }

  getTrainingList(pagenumber: number, pagesize: number): Observable<{total: number, items: any}> {
    const userid = 1; // CHANGE THIS
    const url = `http://localhost:8080/training/list/${userid}/${pagenumber}/${pagesize}`;
    return this.httpClient.get<any>(url).pipe(
      tap(trainings => console.log(`fetched training list`)),
      catchError(this.masterService.handleError('getTrainingList', []))
    );
  }

  deleteTraining(id: number): Observable<any> {
    const userid = 1; // CHANGE THIS
    const url = `http://localhost:8080/training/del/${userid}`;
    const test = {id: id} as Training;
    return this.httpClient.put(url, test, httpOptions).pipe(
      tap(_ => console.log(`Deleted training id: ${id}`)),
      catchError(this.masterService.handleError('deleteTrainingList'))
    );
  }

  addTraining(item: Training): Observable<Training> {
    return this.httpClient.post<Training>(`http://localhost:8080/training/add/1`, item, httpOptions).pipe(
      tap((training: Training) => console.log(`Added Training w/ id=${training.id}`)),
      catchError(this.masterService.handleError<Training>(`addTraining`))
    );
  }

  getTraining(id: number): Observable<Training> {
    return this.httpClient.get<Training>(`http://localhost:8080/training/item/${id}`).pipe(
      tap(training => console.log(`Fetched training id ${id}`)),
      catchError(this.masterService.handleError<Training>('getTraining'))
    );
  }

}
