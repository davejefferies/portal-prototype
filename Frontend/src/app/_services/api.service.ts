import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from './index';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  constructor( private alertService: AlertService, private http: HttpClient ) {}
	
	get(endpoint: string, data: any = {}) {
	  return new Promise((resolve, reject) => {
		  this.http.get(`${environment.api}/api/v${environment.api_version}/${endpoint}`, {params: data})
			.toPromise()
			.then((response: any) => {
				if (response.error) {
				  this.alertService.error(response.error);
				  return reject(response.error);
				}
				return resolve(response);
			})
			.catch((response: any) => {
        if (response.errors) {
          response.errors.forEach((error: any) => {
            this.alertService.error(error);
          });
        } else {
			    this.alertService.error(response);
        }
				return reject(response);
			});
		});
	}
	
	post(endpoint: string, data: any = {}) {
	  return new Promise((resolve, reject) => {
			this.http.post(`${environment.api}/api/v${environment.api_version}/${endpoint}`, data)
			.toPromise()
			.then((response: any) => {
				if (response.error) {
				  this.alertService.error(response.error);
				  return reject(response.error);
				}
				return resolve(response);
			})
			.catch((error: any) => {
			  this.alertService.error(error);
				return reject(error);
			});
		});
	}
	
	patch(endpoint: string, data: any = {}) {
	  return new Promise((resolve, reject) => {
			this.http.patch(`${environment.api}/api/v${environment.api_version}/${endpoint}`, data)
			.toPromise()
			.then((response: any) => {
				if (response.error) {
				  this.alertService.error(response.error);
				  return reject(response.error);
				}
				return resolve(response);
			})
			.catch((error: any) => {
			  this.alertService.error(error);
				return reject(error);
			});
		});
	}
	
	remove(endpoint: string, data: any = {}) {
	  return new Promise((resolve, reject) => {
		  console.log(data);
			const httpOptions = {
				headers: new HttpHeaders(), 
				body: data
			};
			this.http.delete(`${environment.api}/api/v${environment.api_version}/${endpoint}`, httpOptions)
			.toPromise()
			.then((response: any) => {
				if (response.error) {
				  this.alertService.error(response.error);
				  return reject(response.error);
				}
				return resolve(response);
			})
			.catch((error: any) => {
			  this.alertService.error(error);
				return reject(error);
			});
		});
	}
}
