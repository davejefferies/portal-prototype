import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsRouting } from './contact-us.routing';
import { ContactUsComponent } from './contact-us.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContactUsRouting,
		SharedModule
  ],
  declarations: [
	  ContactUsComponent
	]
})
export class ContactUsModule { }