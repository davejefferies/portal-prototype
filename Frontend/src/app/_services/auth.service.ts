import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

import { AlertService, ApiService, SharedService } from '../_services';
import { User } from '../_models';

@Injectable()
export class AuthService {
	private currentAuthSubject: BehaviorSubject<boolean>;
	public currentAuth: Observable<boolean>;
	accessToken: string;
	refreshToken: string;
  //token: string;
	//users: User[] = [];
		
  constructor( private alertService: AlertService, private apiService: ApiService, private http: HttpClient, private sharedService: SharedService ) {
		this.currentAuthSubject = new BehaviorSubject<boolean>(localStorage.getItem('jwt') ? true : false);
		
		this.currentAuth = this.currentAuthSubject.asObservable();
		
		/*this.sharedService.subscribe('users', (data: User[]) => {
			if (!data)
			  return;
			this.users = data;
		});*/
	}
	
	public currentAuthValue() {
	  return new Promise((resolve, reject) => {
			if (!localStorage.getItem('refreshToken'))
				return reject();
			return this.apiService.post('auth/refresh', {refresh_token: localStorage.getItem('refreshToken')}).then((result: any) => {
				localStorage.setItem('accessToken', result.accessToken);
				localStorage.setItem('refreshToken', result.refreshToken);
				this.accessToken = localStorage.getItem('accessToken');
				this.refreshToken = localStorage.getItem('refreshToken');
				this.currentAuthSubject.next(true);
				return resolve();
			}).catch((error: any) => {
				this.currentAuthSubject.next(false);
				return reject();
			});
	  });
  }
	
	login(email: string, password: string) {
	  return new Promise((resolve, reject) => {
		  this.apiService.post('auth', {email, password}).then((response: any) => {
			  if (response.accessToken) {
				  localStorage.setItem('accessToken', response.accessToken);
					localStorage.setItem('refreshToken', response.refreshToken);
					this.accessToken = localStorage.getItem('accessToken');
			    this.refreshToken = localStorage.getItem('refreshToken');
					this.currentAuthSubject.next(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken') ? true : false);
					return resolve();
				}
			  return reject(response);
			}).catch((error: any) => {
				return reject(error);
			});
		});
	}
	
	isValid() {
	  return new Promise((resolve, reject) => {
      if (!localStorage.getItem('accessToken') || localStorage.getItem('accessToken') != this.accessToken || !localStorage.getItem('refreshToken') || localStorage.getItem('refreshToken') != this.refreshToken) {
        this.alertService.error('The token is not valid.', true);
			  this.logout();
				return reject();
      }
      return resolve();
		});
	}
	
	logout() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		this.currentAuthSubject.next(false);
	}
}

