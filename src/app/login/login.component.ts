import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  bsValue: Date;
  bsRangeValue: any[];

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
              private route: Router) {
    this.minDate = new Date(2017, 5, 10);
    this.maxDate = new Date(2018, 9, 15);

    this.bsValue = new Date();
    this.bsRangeValue = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(null)
    });
  }

  signIn(): void {
    const x = new User(this.loginForm.value);
    /* Go ahead and login */
    this.loginService.emitLoggedIn(true);
    this.route.navigate(['/training']);
  }

}
