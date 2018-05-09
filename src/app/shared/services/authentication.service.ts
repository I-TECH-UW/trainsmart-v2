import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BASEURL } from '../../constants';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthUser } from '../models';
import { distinctUntilChanged } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.tokenAvailable());
  private currentUserSubject = new BehaviorSubject<AuthUser>(this.userAvailable());

  get isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  get currentUser(): Observable<AuthUser> {
    return this.currentUserSubject.asObservable();
  }

  constructor(private httpClient: HttpClient, private router:Router) { }

  tokenAvailable(): boolean {
    return !!localStorage.getItem('userToken');
  }

  userAvailable(): AuthUser {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  getUserID(): number {
    return +this.userAvailable().uid;
  }

  login(username: string, password: string, returnUrl: string) {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    /* const reqHeader = new HttpHeaders({
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'No-Auth':'True',
      'Sort':'_firstname'
    }); */
    /* let reqHeader = new HttpHeaders();
    reqHeader.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

    console.log(reqHeader); */

    return this.httpClient.post<any>(`${BASEURL}/authenticate`, formData).map(
      (data: any) => {
        if(data && data.access_token) {

          const authUser = {
            uid: data.user.id,
            email: data.user.email,
            display_name: data.user.display_name,
            roles: {
              sitecoordinator: data.user.roleid === 4 ? true : false,
              countycoordinator: data.user.roleid === 3 ? true : false,
              programmanager: data.user.roleid === 2? true : false,
              admin: data.user.roleid === 1 ? true : false
            }
          }

          localStorage.setItem('userToken', data.access_token);
          localStorage.setItem('currentUser', JSON.stringify(authUser));
          this.currentUserSubject.next(<AuthUser>authUser);
          this.loggedInSubject.next(true);
          return <AuthUser>authUser;
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    this.currentUserSubject.next({} as AuthUser);
    this.router.navigate(['/login']);
  }

  /* Role-based Authorization */
  canRead(user: AuthUser): boolean {
    const allowed = ['admin', 'programmanager', 'countycoordinator', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canAdd(user: AuthUser): boolean {
    const allowed = ['admin', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }
  
  canEdit(user: AuthUser): boolean {
    const allowed = ['admin', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: AuthUser): boolean {
    const allowed = ['admin','sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canApprove(user: AuthUser): boolean {
    const allowed = ['admin', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canScore(user: AuthUser): boolean {
    const allowed = ['admin', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canComplete(user: AuthUser): boolean {
    const allowed = ['admin', 'sitecoordinator']
    return this.checkAuthorization(user, allowed)
  }

  canReview(user: AuthUser): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canCertify(user: AuthUser): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canSign(user: AuthUser): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  /* determines if user has matching role */
  checkAuthorization(user: AuthUser, allowedRoles: string[]): boolean {
    if (!user) return false;
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  }

  getUserRole(user): string {
    if(!user) return '';
    for(const role in user.roles) {
      if(user.roles[role]){
        let resp = '';
        switch(role.toString()) {
          case 'sitecoordinator': resp = 'Site Coordinator'; break;
          case 'countycoordinator': resp = 'County Coordiator'; break;
          case 'programmanager': resp = 'Program Manager'; break;
          case 'admin': resp = 'Admin'; break;
          default: resp = '';
        }
        return resp;
      }
    }
  }

}
