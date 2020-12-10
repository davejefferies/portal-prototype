import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  sortBy: string = 'name';
  columns: any = [
	  {name: 'Client', link: 'client_name', sortable: true},
		{name: 'Notes', link: 'notes', sortable: true},
		{name: 'created', link: 'created', sortable: true, width: '220px'},
		{name: 'Status', link: 'status_name', sortable: true, width: '220px'},
		{name: 'Options', add: true, edit: true, delete: true, width: '170px'}
	];
	data: any = [];
	id: number;
	reseller_id: number;
	myInfo: any = {};
	subscriptions: any = [];
	
  constructor( private alertService: AlertService, private apiService: ApiService, private route: ActivatedRoute, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
		  this.id = params.client_id;
			if (params.reseller_id)
			  this.reseller_id = params.reseller_id;
		});
		
		this.subscriptions.push(this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
			if (this.data)
			  this.data = this.data.filter((obj) => {
				  if (this.reseller_id)
					  return obj.client.reseller.id == this.reseller_id; 
				  return obj.client.reseller.id == this.myInfo.reseller.id; 
				});
		}));
		let uri = 'orders';
		if (this.reseller_id && this.id)
		  uri += '/' + this.reseller_id + '/' + this.id;
		else if (!this.reseller_id && this.id)
		  uri += '/U/' + this.id;
		this.apiService.get(uri).then((result: any) => {
			this.data = result;
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

  onCancel(items: any) {
	  let rid: number;
		if (this.reseller_id)
		  rid = this.reseller_id;
		else if (this.myInfo && this.myInfo.reseller)
		  rid = this.myInfo.reseller.id;
		if (!rid)
		  return this.alertService.error('An error occurred trying to delete the orders.');
		this.apiService.remove('order', {reseller_id: rid, items: items}).then((result: any) => {
		  let uri = 'orders';
			if (this.reseller_id && this.id)
				uri += '/' + this.reseller_id + '/' + this.id;
			else if (!this.reseller_id && this.id)
				uri += '/U/' + this.id;
			this.apiService.get(uri).then((result: any) => {
				this.data = result;
			}).catch((error: any) => {
				console.log(error);
			});
		}).catch((error: any) => {
		  this.alertService.error(error);
		});
	}
}
