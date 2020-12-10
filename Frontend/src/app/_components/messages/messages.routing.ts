import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { MessagesComponent } from './messages.component';
import { MessageEditorComponent } from '../message-editor/message-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: MessagesComponent
  },
	{
    path: 'new',
    canActivate: [ AuthGuard ],
    component: MessageEditorComponent,
		data: {
      breadcrumb: 'New',
			title: 'New'
    }
  },
	{
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: MessageEditorComponent,
		data: {
      breadcrumb: 'Edit',
			title: 'Edit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRouting { }