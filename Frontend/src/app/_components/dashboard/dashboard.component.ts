import { Component, OnInit } from '@angular/core';

import { SharedService } from '../../_services';
import { User, Message, MessageStatus, MessageType } from '../../_models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  messageCount: number = 0;
  messages: Message[] = [];
	alertCount: number = 0;
  alerts: Message[] = [];
	myInfo: User;
	
  constructor( private sharedService: SharedService ) {
	  this.sharedService.subscribe('messages', (details) => {
		  this.messages = [];
			this.alerts = [];
	    if (!details)
			  this.messageCount = 0;
			let unread = details.filter((obj) => { return obj.status == MessageStatus.Unread && obj.type == MessageType.General; });
			let read = details.filter((obj) => { return obj.status == MessageStatus.Read && obj.type == MessageType.General; });
			let a = unread.concat(read);
			this.messageCount = unread.length;
			for (let i = 0; i < 4; i++) {
			  if (a[i])
				  this.messages.push(a[i]);
			}
			
			unread = details.filter((obj) => { return obj.status == MessageStatus.Unread && obj.type == MessageType.Alert; });
			read = details.filter((obj) => { return obj.status == MessageStatus.Read && obj.type == MessageType.Alert; });
			a = unread.concat(read);
			this.alertCount = unread.length;
			for (let i = 0; i < 4; i++) {
			  if (a[i])
				  this.alerts.push(a[i]);
			}
		});
	  this.sharedService.subscribe('my-info', (user: User) => {
			if (user)
			  this.myInfo = user;
		});
	}

  ngOnInit(): void {
  }

}
