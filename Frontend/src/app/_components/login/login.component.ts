import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AuthService, SharedService } from '../../_services';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
		
  constructor( private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private alertService: AlertService, private sharedService: SharedService ) {
	}

  ngOnInit() {
	  this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { 
	  return this.loginForm.controls;
	}
	
	onSubmit() {
	  this.submitted = true;

    if (this.loginForm.invalid)
      return;

    this.loading = true;
		this.authService.login(this.f.email.value, this.f.password.value)
		.then((response: any) => {
		  this.loading = false;
			//this.sharedService.publish('my-info', response.user);
			//localStorage.setItem('my-info', JSON.stringify(response.user));
      let params: any = {};
      if (this.returnUrl && this.returnUrl.indexOf('?') > -1) {
        params = this.getUrlParameter(this.returnUrl.substr(this.returnUrl.indexOf('?')));
        this.returnUrl = this.returnUrl.substr(0, this.returnUrl.indexOf('?'));
      }
			this.router.navigate([this.returnUrl], {queryParams: params});
      return false;
		}).catch((error: any) => {
		  this.alertService.error(error);
      this.loading = false;
      return false;
		});
	}
  
  getUrlParameter(queryString) {
    console.log(queryString);
    var match,
      pl     = /\+/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = queryString.substring(1);
    let urlParams = {};
    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
  }
}
