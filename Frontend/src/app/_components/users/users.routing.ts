import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { UsersComponent } from './users.component';
import { UserEditorComponent } from '../user-editor/user-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: UsersComponent
  },
	{
    path: 'new',
    canActivate: [ AuthGuard ],
    component: UserEditorComponent,
		data: {
      breadcrumb: 'New',
			title: 'New User'
    }
  },
	{
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: UserEditorComponent,
		data: {
      breadcrumb: 'Edit',
			title: 'Edit User'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRouting { }