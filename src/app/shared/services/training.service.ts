import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, filter, tap, catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MasterService } from './master.service';
import { Training } from '../models/training';
import { BASEURL, httpOptions } from '../../constants';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { DataTableParams } from 'angular5-data-table';
import { SharedService } from './shared.service';
import { AuthenticationService } from './authentication.service';
import { AuthUser } from '../models';

@Injectable()
export class TrainingService {
  baseRef: string;
  options: HttpHeaders;
  userid: number;

  constructor(private httpClient: HttpClient, private masterService: MasterService,
  private sharedService:SharedService, private auth:AuthenticationService) { 
    this.options = new HttpHeaders();
    this.options.set('X-Total-Count','0');

    this.userid = this.auth.getUserID();
  }

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
      this.masterService.getTrainingSubCategoryOptions(),
      this.masterService.getTrainingTitleOptions(),
      this.masterService.getTrainingOrganizerOptions(),
      this.masterService.getTrainingLevelOptions(),
      this.masterService.getPepfarCategoryOptions()
    ]);
  }

  getTrainingList(params: DataTableParams, search:string = '', refinedSearch: number = 0): Observable<any> {
    const url = `${BASEURL}/training/list/${this.userid}?refined=${refinedSearch}&search=${search}&`+ this.sharedService.paramsToQueryString(params);
    return this.httpClient.get<any>(url,{headers: this.options, observe: 'response'}).pipe(
      map((res:any) => {
        return {
          items: res.body,
          itemCount: Number(res.headers.get('X-Total-Count'))
        }
      }),
      catchError(this.masterService.handleError('getTrainingList', []))
    );
  }

  getCompletedTrainingList(params: DataTableParams, search: string = '', refinedSearch: number = 0): Observable<any> {
    const url = `${BASEURL}/training/completed/${this.userid}?refined=${refinedSearch}&search=${search}&`+ this.sharedService.paramsToQueryString(params);

    return this.httpClient.get<any>(url,{headers: this.options, observe: 'response'}).pipe(
      map((res:any) => {
        return {
          items: res.body,
          itemCount: Number(res.headers.get('X-Total-Count'))
        };
      }),
      catchError(this.masterService.handleError('getCompletedTrainingList', []))
    );
  }

  getCertApprovalList(id: number): Observable<any> {
    const url = `${BASEURL}/training/certapproval/${id}`;

    return this.httpClient.get<any>(url).pipe(
    //tap(list => console.log(`fetched cert approval list`)),
    catchError(this.masterService.handleError('getCertApprovalList', []))
    );
  }

  deleteTraining(id: number): Observable<any> {
    const url = `${BASEURL}/training/del/${this.userid}`;
    const test = {id: id} as Training;
    return this.httpClient.put(url, test, httpOptions).pipe(
      //tap(_ => console.log(`Deleted training id: ${id}`)),
      catchError(this.masterService.handleError('deleteTrainingList'))
    );
  }

  addTraining(item: Training): Observable<Training> {
    return this.httpClient.post<Training>(`${BASEURL}/training/add/${this.userid}`, item, httpOptions).pipe(
      //tap((training: Training) => console.log(`Added Training w/ id=${training.id}`)),
      catchError(this.masterService.handleError<Training>(`addTraining`))
    );
  }

  getTraining(id: number): Observable<Training> {
    return this.httpClient.get<Training>(`${BASEURL}/training/item/${id}`).pipe(
      //tap(training => console.log(`Fetched training id ${id}`)),
      catchError(this.masterService.handleError<Training>('getTraining'))
    );
  }

  getPerson(search: string, ids: string): Observable<any> {
    const url = `${BASEURL}/training/person/${search}/${ids}`;
    return this.httpClient.get<any>(url).pipe(
      //tap(trainings => console.log(`fetched person to train`)),
      catchError(this.masterService.handleError('getPerson', []))
    );
  }

  getTrainingParticipantsTests(id: number): Observable<any> {
    return this.httpClient.get<any>(`${BASEURL}/training/tests/${id}`).pipe(
      //tap(training => console.log(`Fetched training participant tests id ${id}`)),
      catchError(this.masterService.handleError<any>('getTrainingParticipantsTests'))
    );
  }

  saveUpdateTrainingParticipantsTests(item: any): Observable<boolean> {
    return this.httpClient.post<boolean>(`${BASEURL}/training/savetests/${this.userid}`, item, httpOptions).pipe(
      //tap((flag: boolean) => console.log(`Saved Participant Tests to Training w/ id=${item.training_id}`)),
      catchError(this.masterService.handleError<boolean>(`saveUpdateTrainingParticipantsTests`))
    );
  }

  approveTraining(item: any) {
    return this.httpClient.put<boolean>(`${BASEURL}/training/approve/${this.userid}`, item, httpOptions).pipe(
      //tap((flag: boolean) => console.log(`Approve Training w/ id=${item.training_id}`)),
      catchError(this.masterService.handleError<boolean>(`approveTraining`))
    );
  }

  reviewTraining(id: number) {
    return this.httpClient.put<boolean>(`${BASEURL}/training/review/${this.userid}/${id}`, null, httpOptions).pipe(
      //tap((flag: boolean) => console.log(`Review Training w/ id=${id}`)),
      catchError(this.masterService.handleError<boolean>(`reviewTraining`))
    );
  }

  approveCertificates(id:number, listarray: any) {
    return this.httpClient.put<boolean>(`${BASEURL}/training/certapprove/${this.userid}/${id}`, {list: listarray}, httpOptions).pipe(
      //tap((flag: boolean) => console.log(`Approve Certificates for training w/ id=${id}`)),
      catchError(this.masterService.handleError<boolean>(`approveCertificates`))
    );
  }

  getFileUploadData(id:number) {
    return this.httpClient.get<any>(`${BASEURL}/filedata/${id}`).pipe(
      //tap(training => console.log(`Fetched file upload data for training id ${id}`)),
      catchError(this.masterService.handleError<any>('getFileUploadData'))
    );
  }

  uploadFile(payload: any) {
    return this.httpClient.post(`${BASEURL}/upload/${this.userid}`, payload, httpOptions).pipe(
      //tap((result: any) => console.log(`uploadFile Success`)),
      catchError(this.masterService.handleError<any>(`uploadFile`))
    );
  }

  downloadPDF(trainingid: number, preview: number = 0, previewid: number = 0): any {
    return this.httpClient.get(`${BASEURL}/cert/${trainingid}/${preview}/${previewid}`, { responseType: 'blob'}).map(
      res => {
        if (res.size == 2) {
          return null;
        }
        return new Blob([res], {type: 'application/pdf', });
      }
    );
  }

  printTraining(id: number): any {
    return this.httpClient.get(`${BASEURL}/training/print/${id}`, { responseType: 'blob'}).map(
      res => {
        if (res.type === 'text/html') {
          return null;
        }
        return new Blob([res], {type: 'application/pdf', });
      }
    );
  }

}
