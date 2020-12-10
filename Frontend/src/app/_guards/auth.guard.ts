import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private router: Router, private authService: AuthService ) {
	}
		
  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.authService.currentAuthValue().then(() => {
		  this.authService.isValid().then(() => {
				})
				.catch((e) => {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
				});
				return true;
		}).catch(() => {
		  localStorage.removeItem('accessToken');
		  localStorage.removeItem('refreshToken');
	    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
		});
  }
}
