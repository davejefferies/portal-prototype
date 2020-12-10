import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService, ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  sortBy: string = 'name';
  columns: any = [
		{name: 'Firstname', link: 'firstName', sortable: true},
		{name: 'Lastname', link: 'lastName', sortable: true},
		{name: 'Email', link: 'email', sortable: true},
		{name: 'Role', link: 'role', sortable: true},
		{name: 'Options', add: true, edit: true, delete: true, width: '170px'}
	];
	data: any = [];
	myInfo: any = {};
	reseller_id: number;
	subscriptions: any = [];
	
  constructor( private alertService: AlertService, private apiService: ApiService, private route: ActivatedRoute, private sharedService: SharedService ) {
	  this.route.queryParams.subscribe((params: any) => {
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
					  return obj.reseller.id == this.reseller_id; 
				  return obj.reseller.id == this.myInfo.reseller.id; 
				});
		}));
		
	  this.apiService.get('users' + (this.reseller_id ? '/' + this.reseller_id : '')).then((users: any) => {
		  console.log(users);
			this.data = users;
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

  onDelete(items: any) {
	  let rid: number;
		if (this.reseller_id)
		  rid = this.reseller_id;
		else if (this.myInfo && this.myInfo.reseller)
		  rid = this.myInfo.reseller.id;
		if (!rid)
		  return this.alertService.error('An error occurred trying to deactivate the clients.');
		this.apiService.remove('user', {reseller_id: rid, items: items}).then((result: any) => {
		  this.apiService.get('users' + (this.reseller_id ? '/' + this.reseller_id : '')).then((result: any) => {
				this.data = result;
			}).catch((error: any) => {
				console.log(error);
			});
		}).catch((error: any) => {
		  this.alertService.error(error);
		});
	}
}
