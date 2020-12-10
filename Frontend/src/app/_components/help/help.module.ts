import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRouting } from './help.routing';
import { HelpComponent } from './help.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    HelpRouting,
		SharedModule
  ],
  declarations: [
	  HelpComponent
	]
})
export class HelpModule { }