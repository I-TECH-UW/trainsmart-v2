import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginService {
  // Observable source
  private _isLoggedIn: Subject<boolean> = new Subject<boolean>();
  // Observable stream
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() { }

  // Service commands
  emitLoggedIn(isLoggedIn: boolean) {
    this._isLoggedIn.next(isLoggedIn);
  }

}
