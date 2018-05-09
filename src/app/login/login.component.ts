import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService, AlertService } from '../shared';

import { routerTransition } from '../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  hasQryParams: string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private fb: FormBuilder,
      private alertService: AlertService,
      private spinner: NgxSpinnerService
      ) {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.hasQryParams = this.route.snapshot.queryParams['hasQryParams'] || 'false';
  }

  onSubmit(): void{
    this.spinner.show();
    const model = this.loginForm.value;
    this.authenticationService.login(model.username, model.password, this.returnUrl).subscribe(
      data => {
        if(this.hasQryParams === 'false'){
          this.router.navigate([`/${this.returnUrl}`]);
        }else{
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error => {
        this.alertService.error('Invalid username or password!!');
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
      },
      () => {
        setTimeout(() => {
          this.spinner.hide();
      }, 1000);
      }
    );
  }

}
