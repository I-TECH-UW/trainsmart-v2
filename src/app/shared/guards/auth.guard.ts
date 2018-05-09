import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { AuthenticationService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authenticationService: AuthenticationService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authenticationService.isLoggedIn
      .take(1)
      .map((isLoggedIn: boolean) => {
        if (!isLoggedIn){
          // not logged in so redirect to login page with the return url
          //determine if it has query params so that we can determine how to navigate in login
          const params = JSON.stringify(next.queryParams);
          let hasQryParams = 'false';
          if(params !== '{}') hasQryParams = 'true';
          
          this.router.navigate(['/login'], { queryParams: {returnUrl: state.url, hasQryParams: hasQryParams }});
          return false;
        }
        return true;
      });
  }
}
