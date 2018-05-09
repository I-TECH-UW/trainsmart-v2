import { Injectable } from "@angular/core";
import { TrainingService } from "../services/training.service";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class TrainingResolver implements Resolve<any> {

    constructor(
        private trainingService:TrainingService
    ) {}
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.trainingService.getCachedData().pipe(
            map(
                ([locations, categoryoptions, subcategoryoptions, titleoptions,
                    trainingorganizeroptions, trainingleveloptions, pepfaroptions]) => {
                         const combined = {
                            locations: locations,
                            categoryoptions: categoryoptions,
                            subcategoryoptions: subcategoryoptions,
                            titleoptions: titleoptions,
                            trainingorganizeroptions: trainingorganizeroptions,
                            trainingleveloptions: trainingleveloptions,
                            pepfaroptions: pepfaroptions
                         };
                         return combined;
                     }
            ),
            catchError(
                err => {
                    return new Observable<any>();
                }
            )
        );
    }

}