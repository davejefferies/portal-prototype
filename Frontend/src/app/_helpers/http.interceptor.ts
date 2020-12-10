import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor() {}
	
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
		  let headers: any = {};
			headers['Content-Type'] = 'application/json';
			if (localStorage.getItem('accessToken'))
			  headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      req = req.clone({
			  headers: new HttpHeaders(headers)
      });
      return next.handle(req);
  }
}