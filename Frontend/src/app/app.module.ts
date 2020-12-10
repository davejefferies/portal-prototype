import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent, SidebarComponent, TopbarComponent, LoginComponent, BreadcrumbComponent, NotFoundComponent, TitleComponent, LiveChatComponent } from './_components';
import { AuthGuard } from './_guards';
import { ErrorInterceptor, HttpRequestInterceptor } from './_helpers';
import { ApiService, AuthService, AlertService, SharedService } from './_services';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    SidebarComponent,
    TopbarComponent,
    LoginComponent,
    BreadcrumbComponent,
    NotFoundComponent,
		TitleComponent,
		LiveChatComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ 
	  AuthGuard,
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
		AuthService,
		AlertService,
		SharedService,
		ApiService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
