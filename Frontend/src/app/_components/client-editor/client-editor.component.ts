import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	clients: any = [];
	statuses: any = [];
	id: number;
	reseller_id: number;
	reseller: any;
	myInfo: any;
	subscriptions: any = [];
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
		
		this.subscriptions.push(this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
		}));
		
	  this.form = this.formBuilder.group({
		  id: [null],
			reseller_id: [null],
			name: ['', Validators.required],
			contact: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			status_id: [0, Validators.required]
		});
		
		this.apiService.get('statuses').then((statuses: any) => {
			this.statuses = statuses;
			if (this.id)
				this.apiService.get('client/' + this.id).then((client: any) => {
				  let s = this.statuses.filter((obj) => { return obj.id == client.status_id; })[0];
					this.sharedService.publish('title-extra', '#' + client.id + (s ? ' (' + s.name + ')' : ''));
					this.form.controls['id'].setValue(client.id);
					this.form.controls['name'].setValue(client.name);
					this.form.controls['contact'].setValue(client.contact);
					this.form.controls['email'].setValue(client.email);
					this.form.controls['reseller_id'].setValue(client.reseller_id);
					this.form.controls['status_id'].setValue(client.status_id);
				}).catch((error: any) => {
					console.log(error);
				});
		});
	}

  ngOnInit(): void {
	  
  }
	
	ngOnDestroy(): void {
	  this.sharedService.publish('title-extra', '');
	  this.subscriptions.forEach((sub: any) => {
		  sub.unsubscribe();
		});
	}
	
	get f() { return this.form.controls; }

  onSubmit() {
		if (this.form.invalid)
		  return;
		
		let client: any = this.form.value;
		let pub = (client.id ? 'patch' : 'post');
		if (!client.reseller_id && this.reseller_id)
		  client.reseller_id = this.reseller_id;
		else if (!client.reseller_id && this.myInfo && this.myInfo.reseller && this.myInfo.reseller.id)
		  client.reseller_id = this.myInfo.reseller.id;
		if (!client.reseller_id)
		  return this.alertService.error('Unable to determine the reseller identifier.');
		this.apiService[pub]('client', client).then((result: any) => {
			this.alertService.success('Client has been ' + (!client.id ? 'created' : 'updated') + ' successfully.', true);
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
		array.push('clients');
	  this.router.navigate(array, {queryParams: this.queryParams});
	}
}
