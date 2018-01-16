import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TSROUTES } from './data';
import { Language, TSLANGUAGES } from './language';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TrainSMART';
  routes: any;
  langs: Language[];
  isLoggedIn: boolean;

  constructor(public translate: TranslateService, public toastr: ToastsManager, vRef: ViewContainerRef,
              private loginService: LoginService, private route: Router) {
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

    // Listen to change in login
    this.loginService.isLoggedIn$.subscribe(
      loggedIn => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  ngOnInit() {
    this.loginService.emitLoggedIn(true); // REMOVE THIS
    this.langs = TSLANGUAGES;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Language changed to ' + this.translate.currentLang);
    });

  }

  onLanguageChanged(lang: Language) {
    this.translate.use(lang.code);
  }

  logout() {
    this.route.navigate(['/login']);
    this.loginService.emitLoggedIn(false);
  }
}
