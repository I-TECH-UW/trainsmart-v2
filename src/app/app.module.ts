import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import Third Party Modules
import { MyDesignModule } from './modules/my-design.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastModule, ToastOptions} from 'ng2-toastr/ng2-toastr';

// Main and Child Component
import { AppComponent } from './app.component';
import { AppComponents, AppRoutes, AppEntryComponents, AppServices } from './app.routing';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export class CustomToastOption extends ToastOptions {
  positionClass = 'toast-bottom-full-width';
  showCloseButton = true;
}

@NgModule({
  declarations: [
    AppComponent,
    AppComponents
  ],
  entryComponents: [
    AppEntryComponents
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    FormsModule,
    AngularFontAwesomeModule,
    MyDesignModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastModule.forRoot()
  ],
  providers: [
    AppServices,
    {provide: ToastOptions, useClass: CustomToastOption}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
