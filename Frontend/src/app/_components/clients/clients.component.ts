import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {
  sortBy: string = 'name';
  columns: any = [
	  {name: 'Name', link: 'name', sortable: true},
		{name: 'Contact', link: 'contact', sortable: true},
		{name: 'Email', link: 'email', sortable: true},
		{name: 'Status', link: 'status', sortable: true, width: '220px'},
		{name: 'Options', add: true, edit: true, deactivate: true, width: '170px', otherButtons: [
		  {
			  title: "Orders",
				icon: "silk-basket-put",
				count_field: "orders",
				route: "orders",
				params: {
				  client_id: 'id'
				}
			}
		]}
	];
	data: any = [];
	orders: any = [];
	myInfo: any = {};
	reseller_id: number;
	subscriptions: any = [];
	
  constructor( private alertService: AlertService, private apiService: ApiService, private route: ActivatedRoute, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
		  if (params.reseller_id) {
		    this.reseller_id = params.reseller_id;
				this.columns.filter((obj) => { return obj.name == 'Options'; })[0].otherButtons.filter((obj) => { return obj.title == 'Orders'; })[0].params['reseller_id'] = this.reseller_id;
			}
		});
	  this.subscriptions.push(this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
			if (this.data)
			  this.data = this.data.filter((obj) => {
				  if (this.reseller_id)
					  return obj.reseller.id == this.reseller_id; 
				  return obj.reseller.id == this.myInfo.reseller.id; 
				});
		}));
		
		this.apiService.get('clients' + (this.reseller_id ? '/' + this.reseller_id : '')).then((result: any) => {
			this.data = result;
		}).catch((error: any) => {
		  console.log(error);
		});
	}

  ngOnInit(): void {
  }
	
	ngOnDestroy(): void {
	  this.subscriptions.forEach((sub: any) => {
		  sub.unsubscribe();
		});
	}

  onDeactivate(items: any) {
		let rid: number;
		if (this.reseller_id)
		  rid = this.reseller_id;
		else if (this.myInfo && this.myInfo.reseller)
		  rid = this.myInfo.reseller.id;
		if (!rid)
		  return this.alertService.error('An error occurred trying to deactivate the clients.');
		this.apiService.remove('client', {reseller_id: rid, items: items}).then((result: any) => {
		  this.apiService.get('clients' + (this.reseller_id ? '/' + this.reseller_id : '')).then((result: any) => {
				this.data = result;
			}).catch((error: any) => {
				console.log(error);
			});
		}).catch((error: any) => {
		  this.alertService.error(error);
		});
	}
}
