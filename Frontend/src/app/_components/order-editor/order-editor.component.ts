import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-order-editor',
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.scss']
})
export class OrderEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
	loading: boolean = false;
	submitted: boolean = false;
	clients: any = [];
	orders: any = [];
	types: any = [];
	statuses: any = [];
	id: number;
	client: number;
	myInfo: any = {};
	reseller_id: number;
	subscriptions: any = [];
	queryParams: any = {};
	
  constructor( private alertService: AlertService, private apiService: ApiService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
		  this.queryParams = params;
		  this.client = params.client_id;
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
			client: [{value: (this.client ? this.client : null), disabled: this.client || this.id}, Validators.required],
			items: this.formBuilder.array([]),
			status: 2,
			notes: ['']
		});
		
		if (!this.id) {
		  let items = <FormArray>this.form.controls['items'];
			items.push(this.formBuilder.group({
			  id: [null],
				kind: ['new', Validators.required],
				type: [0, Validators.required],
				number: ['', Validators.required],
				label: ['', Validators.required],
				status: [2]
			}));
		}
		
		this.apiService.get('clients' + (this.reseller_id ? '/' + this.reseller_id : '')).then((clients: any) => {
			this.clients = clients;
		}).catch((error: any) => {
		  console.log(error);
		});
		
		this.apiService.get('order/types').then((types: any) => {
			this.types = types;
		}).catch((error: any) => {
		  console.log(error);
		});
		
		this.apiService.get('order/status').then((statuses: any) => {
			this.statuses = statuses;
      if (this.id)
				this.apiService.get('order/' + this.id).then((order: any) => {
					let s = this.statuses.filter((obj) => { return obj.id == order.status; })[0];
					this.sharedService.publish('title-extra', '#' + order.id + (s ? '(' + s.value + ')' : ''));
					this.form.controls['id'].setValue(order.id);
					this.form.controls['reseller_id'].setValue(order.reseller_id);
					this.form.controls['client'].setValue(order.client);
					this.form.controls['status'].setValue(order.status);
					let items = <FormArray>this.form.controls['items'];
					order.items.forEach((item: any) => {
						items.push(this.formBuilder.group({
							id: [item.id],
							kind: [item.kind, Validators.required],
							type: [item.type, Validators.required],
							number: [item.number, Validators.required],
							label: [item.label, Validators.required],
							status: [{value: item.status, disabled: this.myInfo.permissionLevel < 6000}]
						}));
					});
				}).catch((error: any) => {
					console.log(error);
				});
		}).catch((error: any) => {
		  console.log(error);
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
	
	addItem() {
	  let items = <FormArray>this.form.controls['items'];
		items.push(this.formBuilder.group({
			id: [null],
			kind: ['', Validators.required],
			type: [0, Validators.required],
			number: ['', Validators.required],
			label: ['', Validators.required],
			status: [2]
		}));
	}
	
	removeItem(i: number) {
	  this.form.controls['items']['controls'][i].controls['status'].setValue(8);
	}
	
	onSubmit() {
		if (this.form.invalid)
		  return;
		if (this.itemCount() == 0)
		  return this.alertService.error("There must be at least one item in the order.");
			
		let d = new Date();
		let date: string = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + ' ' + (d.getDate() < 10 ? '0' : '') + d.getDate() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + d.getFullYear();
			
		let order: any = this.form.value;
		let pub = (order.id ? 'patch' : 'post');
		
		if (!order.reseller_id && this.reseller_id)
		  order.reseller_id = this.reseller_id;
		else if (!order.reseller_id && this.myInfo && this.myInfo.reseller && this.myInfo.reseller.id)
		  order.reseller_id = this.myInfo.reseller.id;
		if (!order.reseller_id)
		  return this.alertService.error('Unable to determine the reseller identifier.');
		this.apiService[pub]('order', order).then((result: any) => {
			this.alertService.success('Order has been ' + (!order.id ? 'created' : 'updated') + ' successfully.', true);
			this.goBack();
		}).catch((error: any) => {
		  console.log(error);
		});
	}
	
	goBack() {
	  let array: any = [];
		if ('reseller_id' in this.queryParams) {
		  array.push('resellers');
			if ('client_id' in this.queryParams)
			  array.push('clients');
		}
		array.push('orders');
	  this.router.navigate(array, {queryParams: this.queryParams});
	}
	
	itemCount() {
	  return this.form.get('items').value.filter((obj) => { return obj.status != 8; }).length;
	}
}
