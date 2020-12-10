import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, SharedService } from '../../_services';

@Component({
  selector: 'app-resellers',
  templateUrl: './resellers.component.html',
  styleUrls: ['./resellers.component.scss']
})
export class ResellersComponent implements OnInit, OnDestroy {
  sortBy: string = 'name';
  columns: any = [
	  {name: 'Name', link: 'name', sortable: true},
		{name: 'Address', link: 'address', sortable: true},
		{name: 'Phone', link: 'phone', sortable: true},
		{name: 'Options', add: true, edit: true, width: '170px', otherButtons: [
		  {
			  title: "Clients",
				icon: "silk-group",
				route: "clients",
				params: {
				  reseller_id: 'id'
				}
			},
			{
			  title: "Orders",
				icon: "silk-basket-go",
				route: "orders",
				params: {
				  reseller_id: 'id'
				}
			},
			{
			  title: "Users",
				icon: "silk-user",
				route: "users",
				params: {
				  reseller_id: 'id'
				}
			}
		]}
	];
	data: any = [];
	myInfo: any = {};
	subscriptions: any = [];
	
  constructor( private apiService: ApiService, private sharedService: SharedService ) {
	  this.subscriptions.push(this.sharedService.subscribe('resellers', (details) => {
	    this.data = details;
		}));
		
		this.subscriptions.push(this.sharedService.subscribe('my-info', (details) => {
	    this.myInfo = details;
		}));
		
		this.apiService.get('resellers').then((result: any) => {
			this.data = result
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

  onCallback(ev: any) {
		if (ev && ev.event)
		  this[ev.event](ev.item);
	}
}
