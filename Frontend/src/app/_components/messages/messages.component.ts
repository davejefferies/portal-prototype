import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { Message, MessageStatus, MessageStatuses, MessageType, MessageTypes, User } from '../../_models';
import { SharedService } from '../../_services';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  sortBy: string = '';
  columns: any = [
	  {name: 'Subject', link: 'subject', sortable: true},
		{name: 'Created', link: 'created', width: '200px', sortable: true},
		{name: 'Severity', link: 'severity', hidden: true, width: '200px', sortable: true},
		{name: 'Options', markRead: true, delete: true, extraParams: { type: 'type' }, width: '140px'}
	];
	data: Message[] = [];
	allData: Message[] = [];
	currentRoute: string = '/';
	myInfo: User;
	subscriptions: any = [];
	
  constructor( private router: Router, private sharedService : SharedService ) {
		router.events.subscribe(event => { 
		  if (event instanceof NavigationEnd) {
		    this.currentRoute = event.url; 
				if (event.url.toLowerCase() == '/alerts')
				  this.columns.filter((obj) => { return obj.link == 'severity'; })[0].hidden = false;
				else
				  this.columns.filter((obj) => { return obj.link == 'severity'; })[0].hidden = true;
			}
		});
		
		this.subscriptions.push(this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
			if (data.role < 2) {
			  let col: any = this.columns.filter((obj) => { return obj.name == 'Options'; })[0];
				col.add = true;
				col.edit = true;
			}
			if (this.allData)
			  this.allData = this.allData.filter((obj) => { return !obj.reseller || obj.reseller.id == this.myInfo.reseller.id; });
		}));
		
		this.subscriptions.push(this.sharedService.subscribe('messages', (data: Message[]) => {
		  console.log(data);
		  data.filter((obj) => { return obj.delete || obj.expanded; }).forEach((item) => {
			  item.delete = false;
				item.expanded = false;
			});
		  this.allData = data;
			if (this.allData)
			  this.allData = this.allData.filter((obj) => { return !obj.reseller || obj.reseller.id == this.myInfo.reseller.id; });
		}));
	}

  ngOnInit(): void {
	  let data: any;
	  if (this.currentRoute == '/alerts')
		  data = this.allData.filter((obj) => { return obj.type == 1; });
		else
		  data = this.allData.filter((obj) => { return obj.type == 0; });
		let unread = data.filter((obj) => { return obj.status == 1; });
		let read = data.filter((obj) => { return obj.status == 2; });
		this.data = unread.concat(read);
  }
	
	ngOnDestroy(): void {
	  this.subscriptions.forEach((sub: any) => {
		  sub.unsubscribe();
		});
	}

  onUpdate() {
		this.sharedService.publish('messages', this.allData);
	}
	
	onDelete(items: any) {
	  let objs: any = this.allData.filter((obj: any) => { return !items.includes(obj.id); });
		this.allData = objs;
		let data: any;
	  if (this.currentRoute == '/alerts')
		  data = this.allData.filter((obj) => { return obj.type == 1; });
		else
		  data = this.allData.filter((obj) => { return obj.type == 0; });
		let unread = data.filter((obj) => { return obj.status == 1; });
		let read = data.filter((obj) => { return obj.status == 2; });
		this.data = unread.concat(read);
		this.sharedService.publish('messages', objs);
	}
	
	onMarkRead(items: any) {
	  let objs: any = this.allData.filter((obj: any) => { return items.includes(obj.id); });
		objs.forEach((item) => {
		  item.status = 2;
		});
		this.onUpdate();
	}
}
