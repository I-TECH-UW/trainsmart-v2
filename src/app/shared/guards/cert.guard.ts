import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class CertGuard implements CanActivate {

  constructor(private auth:AuthenticationService, private router:Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.currentUser.pipe(
      take(1),
      map(user => (user && (user.roles.admin || user.roles.programmanager || user.roles.countycoordinator)) ? true : false),
      tap(canCertify =>{
        if (!canCertify) {
          // Access denied - You cannot certify
          this.router.navigate(['/denied'])
        }
      })
    );
  }
}
