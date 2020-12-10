import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-reseller-editor',
  templateUrl: './reseller-editor.component.html',
  styleUrls: ['./reseller-editor.component.scss']
})
export class ResellerEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	id: number;
	myInfo: any = {};
	
  constructor( private alertService: AlertService, private apiService: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private sharedService: SharedService ) {
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
			name: ['', Validators.required],
			address: ['', Validators.required],
			suburb: ['', Validators.required],
			city: ['', Validators.required],
			country: ['New Zealand', Validators.required],
			postcode: ['', Validators.required],
			phone: ['', Validators.required],
			account: [null]
		});
		
		if (this.id)
		  this.apiService.get('reseller/' + this.id).then((reseller: any) => {
			  this.sharedService.publish('title-extra', '#' + reseller.id);
				this.form.controls['id'].setValue(reseller.id);
				this.form.controls['name'].setValue(reseller.name);
				this.form.controls['address'].setValue(reseller.address);
				this.form.controls['suburb'].setValue(reseller.suburb);
				this.form.controls['city'].setValue(reseller.city);
				this.form.controls['country'].setValue('New Zealand');
				this.form.controls['postcode'].setValue(reseller.postcode);
				this.form.controls['phone'].setValue(reseller.phone);
				this.form.controls['account'].setValue(reseller.account);
			}).catch((error: any) => {
			  console.log(error);
			});
	}

  ngOnInit(): void {
  }
	
	ngOnDestroy(): void {
	  this.sharedService.publish('title-extra', null);
	}
	
	get f() { return this.form.controls; }

  onSubmit() {
	  if (this.form.invalid)
		  return;
		
		let reseller: any = this.form.value;
		
		let pub = (reseller.id ? 'patch' : 'post');
		this.apiService[pub]('reseller', reseller).then((result: any) => {
			this.alertService.success('Reseller has been ' + (!reseller.id ? 'created' : 'updated') + ' successfully.', true);
			this.router.navigate(['/resellers']);
		}).catch((error: any) => {
		  console.log(error);
		});
	}
}
