import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
//import { MessageStatus, MessageType, User } from '../../_models';
import { ApiService, AuthService, SharedService } from '../../_services';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentAuth: boolean;
	currentRoute: string = '/';
	clientCount: number = 0;
	alertCount: number = 0;
	resellerCount: number = 0;
	messageCount: number = 0;
	orderCount: number = 0;
	messageExpand: boolean = false;
	myInfo: any;
	
  constructor( private apiService: ApiService, private authService: AuthService, private router: Router, private sharedService: SharedService ) {
		this.authService.currentAuth.subscribe((bln: boolean) => {
		  this.currentAuth = bln;
		});
		
		this.sharedService.subscribe('my-info', (data) => {
			if (!data)
			  return;
			this.myInfo = data;
		});
		
		this.sharedService.subscribe('reseller-count', (cnt: number) => {
		  this.resellerCount = cnt;
		});
		
		this.sharedService.subscribe('client-count', (cnt: number) => {
		  this.clientCount = cnt;
		});
		
		this.sharedService.subscribe('message-count', (cnt: number) => {
		  this.messageCount = cnt;
		});
		
		this.sharedService.subscribe('alert-count', (cnt: number) => {
		  this.messageCount = cnt;
		});
		
		this.apiService.get('count/resellers').then((response: any) => {
		  this.sharedService.publish('reseller-count', response);
		}).catch((error: any) => {
		});
		
		this.apiService.get('count/clients').then((response: any) => {
		  this.sharedService.publish('client-count', response);
		}).catch((error: any) => {
		});
		
		this.apiService.get('count/messages').then((response: any) => {
		  this.sharedService.publish('message-count', response);
		}).catch((error: any) => {
		});
		
		this.apiService.get('count/alerts').then((response: any) => {
		  this.sharedService.publish('alert-count', response);
		}).catch((error: any) => {
		});
		
		/*this.sharedService.subscribe('messages', (details) => {
	    if (!details) {
			  this.messageCount = 0;
				return this.alertCount = 0;
			}
			setTimeout(() => { 
			  this.messageCount = details.filter((obj) => { return obj.status == MessageStatus.Unread && obj.type == MessageType.General && (!obj.reseller || obj.reseller.id == this.myInfo.reseller.id); }).length;
			  this.alertCount = details.filter((obj) => { return obj.status == MessageStatus.Unread && obj.type == MessageType.Alert && (!obj.reseller || obj.reseller.id == this.myInfo.reseller.id); }).length;
			}, 1000);
		});
		
		this.sharedService.subscribe('resellers', (details) => {
	    if (!details)
			  this.resellerCount = 0;
			this.resellerCount = details.length;
		});
		
		this.sharedService.subscribe('clients', (details) => {
	    if (!details)
			  this.clientCount = 0;
			setTimeout(() => { if (this.myInfo) this.clientCount = details.filter((obj) => { return obj.reseller.id == this.myInfo.reseller.id; }).length }, 1000);
		});*/
		
		router.events.subscribe(event => { 
		  if (event instanceof NavigationEnd) {
		    this.currentRoute = event.url; 
			}
		});
  }

  ngOnInit(): void {
  }

  messageToggle() {
	  this.messageExpand = !this.messageExpand;
	}
	
	isCurrentRoute(name: string): boolean {
	  return this.currentRoute.split('?')[0].split('/new')[0].split('/edit')[0].endsWith('/' + name);
	}
}
