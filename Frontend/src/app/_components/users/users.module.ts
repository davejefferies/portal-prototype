import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRouting } from './users.routing';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from '../user-editor/user-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    UsersRouting,
		SharedModule
  ],
  declarations: [
	  UsersComponent,
		UserEditorComponent
	]
})
export class UsersModule { }