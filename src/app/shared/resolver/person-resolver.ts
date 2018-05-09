import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PersonService } from '../services/person.service';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class PersonResolver implements Resolve<any> {

    constructor(
        private router:Router,
        private personService:PersonService
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<any> {
        const id = route.paramMap.get('id');
        /* return this.personService.getPerson(+id).pipe(
            catchError(
                err => {
                    console.error(err); // deal with API error (eg not found)
                    this.router.navigate(['/']); // could redirect to error page
                    return new Observable<any>();
                }
            )
        ); */
        return this.personService.getCachedData().pipe(
            map(
                ([titleList, suffixList, genderList, qualificationList, primaryResponsibilityList,
                     secondaryResponsibilityList, reasonAttendingList]) => {
                         const combined = {
                             titleList: titleList,
                             suffixList: suffixList
                         };
                         return combined;
                     }
            ),
            catchError(
                err => {
                    console.error(err); // deal with API error (eg not found)
                    this.router.navigate(['/']); // could redirect to error page
                    return new Observable<any>();
                }
            )
        );
    }
}
