import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  currentAuth: boolean;
	title: string = '';

  constructor( private authService: AuthService, private router: Router ) {
    this.authService.currentAuth.subscribe(x => this.currentAuth = x);
  }
	
	ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd))
        return;
			const container = document.querySelector('#content-area');
      container.scrollTo(0, 0)
    });
  }
}