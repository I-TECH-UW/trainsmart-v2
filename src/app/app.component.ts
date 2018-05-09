import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TSROUTES } from './data';
import { Language, TSLANGUAGES } from './language';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthenticationService, LoginService, AuthUser} from './shared';
import { Observable } from 'rxjs/Observable';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TrainSMART';
  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<AuthUser>;
  routes: any;
  langs: Language[];

  constructor(public translate: TranslateService, public toastr: ToastsManager, vRef: ViewContainerRef,
              public authenticationService: AuthenticationService) {

    //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // toastr will be active in all the components of our application
    this.toastr.setRootViewContainerRef(vRef);

    // Set the language according to the browser/navigator language
    let lang = this.translate.getBrowserLang();
    lang = /(en|nl|fr|ru|uk|es|pt)/gi.test(lang) ? lang : 'en';

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang);

    this.routes = TSROUTES;
  }

  ngOnInit() {
    this.langs = TSLANGUAGES;

    /* this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Language changed to ' + this.translate.currentLang);
    }); */

    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
    this.currentUser$ = this.authenticationService.currentUser;
    /* this.currentUser$.subscribe(
      authuser => console.log('Auth User Role may just work: ', authuser)
    ); */
  }

  onLanguageChanged(lang: Language) {
    this.translate.use(lang.code);
  }

  onLogout() {
    this.authenticationService.logout();
  }
}
