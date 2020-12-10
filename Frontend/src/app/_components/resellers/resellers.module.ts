import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResellersRouting } from './resellers.routing';
import { ResellersComponent } from './resellers.component';
import { ResellerEditorComponent } from '../reseller-editor/reseller-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ResellersRouting,
		SharedModule
  ],
  declarations: [
	  ResellersComponent,
		ResellerEditorComponent
	]
})
export class ResellersModule { }