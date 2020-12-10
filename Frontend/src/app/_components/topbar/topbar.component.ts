import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, ApiService, AuthService, SharedService } from '../../_services';
//import { User } from '../../_models';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
	host:{
    '(document:mouseover)': 'clickedOutside($event)'
  }
})
export class TopbarComponent implements OnInit {
  currentAuth: boolean;
	//currentUser: any = {
  //  firstname: 'David',
  //  lastname: 'Jefferies'
  //};
	isUserExpanded: boolean = false;
	myInfo: any;
  
  constructor( private alertService: AlertService, private apiService: ApiService, private authService: AuthService, private elRef: ElementRef, private router: Router, private sharedService: SharedService ) {
    this.authService.currentAuth.subscribe((bln: boolean) => {
		  this.currentAuth = bln;
		});
		/*this.sharedService.subscribe('my-info', (data) => {
			if (data)
			  this.myInfo = data;
		});*/
		this.apiService.get('my-info').then((result: any) => {
		  this.myInfo = result;
			this.sharedService.publish('my-info', result);
		}).catch((error: any) => {
		  console.log(error);
		});
  }

  ngOnInit() {
	  
  }
	
	clickedOutside(ev) {
    if (!this.elRef.nativeElement.querySelector('#profile-toggle') || !this.elRef.nativeElement.querySelector('#user-menu'))
			return;
		var position = this.elRef.nativeElement.querySelector('#profile-toggle').getBoundingClientRect();
		var positionMenu = this.elRef.nativeElement.querySelector('#user-menu').getBoundingClientRect();
		let bln1: boolean = !(ev.clientY > position.top && ev.clientY < position.top + position.height && ev.clientX > position.left && ev.clientX < position.left + position.width);
		let bln2: boolean = !(ev.clientY > positionMenu.top && ev.clientY < positionMenu.top + positionMenu.height && ev.clientX > positionMenu.left && ev.clientX < positionMenu.left + positionMenu.width);
		if (bln1 && bln2)
			this.isUserExpanded = false;
  }

  menuLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
	
	menuProfile() {
	  this.alertService.error('Profile has not been implemented yet.');
	}
	
	userToggle() {
		this.isUserExpanded = true;
	}
}
