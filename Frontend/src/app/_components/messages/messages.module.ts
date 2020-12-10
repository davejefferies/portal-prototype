import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRouting } from './messages.routing';
import { MessagesComponent } from './messages.component';
import { MessageEditorComponent } from '../message-editor/message-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    MessagesRouting,
		SharedModule
  ],
  declarations: [
	  MessagesComponent,
		MessageEditorComponent
	]
})
export class MessagesModule { }