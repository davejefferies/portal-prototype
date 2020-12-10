import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { SharedService } from '../../_services';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  title: string = '';
	extra: string = '';
	
  constructor( private activatedRoute: ActivatedRoute, private router: Router, private sharedService: SharedService  ) {
		this.sharedService.subscribe('title-extra', (data: string) => {
		  if (data)
		    this.extra = data;
			else
			  this.extra = '';
		});
	}

  ngOnInit(): void {
	  this.title = this.getTitle(this.activatedRoute, '');
	  this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      this.title = this.getTitle(this.activatedRoute, '');
    });
  }

  getTitle(route: ActivatedRoute, cTitle: string) {
		let title = route.routeConfig && route.routeConfig.data && route.routeConfig.data.title ? route.routeConfig.data.title : cTitle;
		if (route.firstChild)
		  return this.getTitle(route.firstChild, title);
		return title;
	}
}
