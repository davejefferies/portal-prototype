import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Breadcrumb } from '../../_models/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public crumbs: Breadcrumb[]
  params: any = {};
  
  constructor( private router: Router, private activatedRoute: ActivatedRoute ) {
    this.crumbs = this.buildCrumb(this.activatedRoute.root);
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.crumbs = this.buildCrumb(this.activatedRoute);
    })
  }
  
  buildCrumb(route: ActivatedRoute, url: string = '', crumbs: Breadcrumb[] = []): Breadcrumb[] {
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data && route.routeConfig.path ? route.routeConfig.path : '';
    let icon = route.routeConfig && route.routeConfig.data && route.routeConfig.data.icon ? route.routeConfig.data.icon : '';
    let iconOnly = route.routeConfig && route.routeConfig.data && route.routeConfig.data.iconOnly ? route.routeConfig.data.iconOnly : false;
    let qParams = route.routeConfig && route.routeConfig.data && route.routeConfig.data && route.routeConfig.data.params ? route.routeConfig.data.params : this.params;
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if(isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      url = path.replace(lastRoutePart, route.snapshot.params[paramName]);
    }
    
    let nextUrl = '';
    crumbs.forEach((c: any) => {
      nextUrl += c.url + '/';
    });
    nextUrl += (crumbs.length > 0 ? path : url);
		
		let prev: string;
		let array: any = [];
		nextUrl.split('/').forEach((item) => {
		  if (item) {
			  if (array.length == 0 || array[array.length - 1] != item)
				  array.push(item);
			}
		});
  
    const crumb: Breadcrumb = {
        label: label,
        url: array.join('/'),
        params: qParams,
        icon: icon,
        iconOnly: iconOnly
    };

    const newCrumbs = crumb.label ? [ ...crumbs, crumb ] : [ ...crumbs];
    if (route.firstChild)
        return this.buildCrumb(route.firstChild, nextUrl, newCrumbs);
    return newCrumbs;
  }
}