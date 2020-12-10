import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApiService, SharedService } from '../../_services';
import { MustMatchValidator, PatternValidator } from '../../_helpers';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  form: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	users: any = [];
	id: number;
	roles: any = [];
	myInfo: any = {};
	reseller_id: number;
	permissions: any = [];
	queryParams: any = {};
	
  constructor( private alertService: AlertService, private apiService: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
		  this.queryParams = params;
		  if (params.reseller_id)
		    this.reseller_id = params.reseller_id;
		});
		
	  this.route.params.subscribe((params: any) => {
		  this.id = params.id;
		});
		
		this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
		});
		
		this.form = this.formBuilder.group({
		  id: [null],
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			permissionLevel: ['', Validators.required],
			password: [null, [Validators.required, Validators.minLength(6), PatternValidator(/\d/, { hasNumber: true }), PatternValidator(/[A-Z]/, { hasCapitalCase: true }), PatternValidator(/[a-z]/, { hasSmallCase: true })]],
			confirmPassword: [null, Validators.required]
		}, {
		  validator: MustMatchValidator('password', 'confirmPassword')
		});
		
		this.apiService.get('permissions').then((perms: any) => {
			this.permissions = perms;
		}).catch((error: any) => {
		  console.log(error);
		});
		
		if (this.id) {
		  this.form.controls['password'].setValidators([Validators.minLength(6), PatternValidator(/\d/, { hasNumber: true }), PatternValidator(/[A-Z]/, { hasCapitalCase: true }), PatternValidator(/[a-z]/, { hasSmallCase: true })]);
			this.form.controls['password'].updateValueAndValidity();
			this.form.controls['confirmPassword'].setValidators(null);
			this.form.controls['confirmPassword'].updateValueAndValidity();
			this.apiService.get('user/' + this.id).then((user: any) => {
				this.sharedService.publish('title-extra', '#' + user.id);
				this.form.controls['id'].setValue(user.id);
				this.form.controls['firstName'].setValue(user.firstName);
				this.form.controls['lastName'].setValue(user.lastName);
				this.form.controls['email'].setValue(user.email);
				this.form.controls['permissionLevel'].setValue(user.permissionLevel);
			}).catch((error: any) => {
				console.log(error);
			});
		}
	}

  ngOnInit(): void {
  }

  get f() { return this.form.controls; }
	
	onSubmit() {
		if (this.form.invalid)
		  return;
			
		let user: any = this.form.value;
		let pub = (user.id ? 'patch' : 'post');
		if (!user.reseller_id && this.reseller_id)
		  user.reseller_id = this.reseller_id;
		else if (!user.reseller_id && this.myInfo && this.myInfo.reseller && this.myInfo.reseller.id)
		  user.reseller_id = this.myInfo.reseller.id;
		if (!user.reseller_id)
		  return this.alertService.error('Unable to determine the reseller identifier.');
		this.apiService[pub]('user', user).then((result: any) => {
			this.alertService.success('User has been ' + (!user.id ? 'created' : 'updated') + ' successfully.', true);
			this.goBack();
		}).catch((error: any) => {
		  console.log(error);
		});
	}
	
	goBack() {
	  let array: any = [];
		if ('reseller_id' in this.queryParams) {
		  array.push('resellers');
		}
		array.push('users');
	  this.router.navigate(array, {queryParams: this.queryParams});
	}
}
