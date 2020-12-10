import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRouting } from './clients.routing';
import { ClientsComponent } from './clients.component';
import { ClientEditorComponent } from '../client-editor/client-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ClientsRouting,
		SharedModule
  ],
  declarations: [
	  ClientsComponent,
		ClientEditorComponent
	]
})
export class ClientsModule { }