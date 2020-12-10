import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SharedService {
	private subscriptions: any = {};
	private store: any = {};
	private clear: boolean = false;
	
  constructor() {
	  /*this.setupResellers();
	  this.setupClients();
		this.setupUsers();
		this.setupOrders();
		this.setupHelp();
		this.setupMessages();*/
  }
	
	publish(event, value) {
	  if (!this.store[event]) {
		  this.store[event] = {};
		  this.store[event].subject = new Subject<any>();
			this.store[event].data = this.store[event].subject.asObservable();
		}
		if (this.store[event].subject)
		  this.store[event].subject.next(value);
		this.store[event].lastMsg = value;
		localStorage.setItem(event, JSON.stringify(value));
	}
	
	subscribe(event: string, callback: Function) {
	  if (!this.store[event]) {
		  this.store[event] = {};
		  this.store[event].subject = new Subject<any>();
			this.store[event].data = this.store[event].subject.asObservable();
		}
		if ('lastMsg' in this.store[event]) {
		  callback.call(null, this.store[event].lastMsg);
		}
		return this.store[event].data.subscribe((data) => {
		  callback.call(null, data);
		});
	}
	
	
	
	/*setupResellers() {
	  if (this.clear)
		  localStorage.removeItem('resellers');
	  if (localStorage.getItem('resellers'))
		  return this.publish('resellers', JSON.parse(localStorage.getItem('resellers')));
	  let resellers: Reseller[] = [];
		for (let i = 1; i <= 2; i++) {
		  let reseller: Reseller = {
			  id: i,
				account: 'ABC123' + i,
				name: 'Test Reseller' + i,
				portal_id: i,
				address: i + ' Main Street',
				suburb: 'Cannons Creek',
				city: 'Porirua',
				country: 'New Zealand',
				postcode: 12345 + i,
				phone: '04123456' + i
			};
			resellers.push(reseller);
		}
		this.publish('resellers', resellers);
	}
	
	setupClients() {
	  if (this.clear)
		  localStorage.removeItem('clients');
	  if (localStorage.getItem('clients'))
		  return this.publish('clients', JSON.parse(localStorage.getItem('clients')));
	  let clients: Client[] = [];
		for (let i = 1; i <= 20; i++) {
		  let r = this.store['resellers'].lastMsg[Math.round(Math.random())];
		  let client: Client = {
			  id: i,
				reseller: r,
				name: 'Test Client' + i,
				contact: 'Joe Bob' + i,
				email: 'joe.bob' + i + '@testclient.com',
				status: 0
			};
			clients.push(client);
		}
		this.publish('clients', clients);
	}
	
	setupUsers() {
	  if (this.clear)
		  localStorage.removeItem('users');
	  if (localStorage.getItem('users'))
		  return this.publish('users', JSON.parse(localStorage.getItem('users')));
	  let users: User[] = [];
	  let user: User = {
		  id: 1,
			reseller: this.store['resellers'].lastMsg[0],
			firstname: 'Super Admin',
			lastname: '',
			email: 'admin@an.net.nz',
			role: 1,
			username: 'admin',
			password: 'admin',
			hidden: false,
			token: 'abasdfdgfio235ef89'
		};
		users.push(user);
		user = {
		  id: 2,
			reseller: this.store['resellers'].lastMsg[1],
			firstname: 'Bob',
			lastname: 'Smith',
			email: 'adbob@an.net.nz',
			role: 2,
			username: 'bob',
			password: 'bob',
			hidden: false,
			token: 'bobabasdfdgfio235ef89'
		};
		users.push(user);
		this.publish('users', users);
	}
	
	setupOrders() {
	  if (this.clear)
		  localStorage.removeItem('orders');
	  if (localStorage.getItem('orders'))
		  return this.publish('orders', JSON.parse(localStorage.getItem('orders')));
	  let d = new Date();
		let date: string = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + ' ' + (d.getDate() < 10 ? '0' : '') + d.getDate() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + d.getFullYear();
	  let item: OrderItem = {
		  id: 1,
			kind: 'new',
			type: OrderType.Extension,
			number: 123,
			label: 'Joe Bloggs',
			stamp: date,
			status: OrderStatus.Requested
		};
		
		let order: Order = {
		  id: 1,
			client: this.store['clients'].lastMsg[0],
			created: date,
			items: [item],
			history: [],
			status: OrderStatus.Requested
		};
		
		let orders: Order[] = [];
		orders.push(order);
		this.publish('orders', orders);
	}
	
	setupHelp() {
	  if (this.clear)
		  localStorage.removeItem('help');
	  if (localStorage.getItem('help'))
		  return this.publish('help', JSON.parse(localStorage.getItem('help')));
	  let items: Help[] = [];
		for (let i = 1; i <= 12; i++) {
		  let g: number = Math.round(Math.random() * 3);
			let caq: number = Math.round(Math.random());
		  let help: Help = {
			  id: i,
				group: g,
				priority: items.filter((obj) => { return obj.group == g; }).length + 1,
				expanded: false,
				question: 'What is the Question #' + i + '?',
				answer: 'This is the Answer #' + i + '.<br /><br />To show what it would look like.',
				caq: caq ? true : false,
				caq_priority: caq ? items.filter((obj) => { return obj.caq; }).length + 1 : 0,
				caq_expanded: false
			};
			items.push(help);
		}
		this.publish('help', items);
	}
	
	setupMessages() {
	  if (this.clear)
		  localStorage.removeItem('messages');
	  if (localStorage.getItem('messages'))
		  return this.publish('messages', JSON.parse(localStorage.getItem('messages')));
	  let d = new Date();
		let date: string = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + ' ' + (d.getDate() < 10 ? '0' : '') + d.getDate() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + d.getFullYear();
	  let items: Message[] = [];
		
		for (let i = 1; i <= 15; i++) {
		  let type = Math.round(Math.random());
		  let msg: Message = {
			  id: i,
				reseller: 0,
				subject: 'Test Message #' + i,
				body: 'This is the body of the test message #' + i + '<br /><br />Blah is me.',
				created: date,
				type: type,
				status: (Math.round(Math.random()) + 1),
				severity: (type == 0 ? 0 : (Math.floor(Math.random() * 4) + 1))
			};
			
			items.push(msg);
		}
		this.publish('messages', items);
	}*/
}

