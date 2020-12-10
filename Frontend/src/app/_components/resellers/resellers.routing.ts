import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { ResellersComponent } from './resellers.component';
import { ResellerEditorComponent } from '../reseller-editor/reseller-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ResellersComponent
  },
	{
    path: 'new',
    canActivate: [ AuthGuard ],
    component: ResellerEditorComponent,
		data: {
      breadcrumb: 'New',
			title: 'New Reseller'
    }
  },
	{
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: ResellerEditorComponent,
		data: {
      breadcrumb: 'Edit',
			title: 'Edit Reseller'
    }
  },
	{
    path: 'orders',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../orders/orders.module').then(m => m.OrdersModule),
		data: {
      breadcrumb: 'Orders',
			title: 'Orders'
    }
  },
	{
    path: 'clients',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../clients/clients.module').then(m => m.ClientsModule),
		data: {
      breadcrumb: 'Clients',
			title: 'Clients'
    }
  },
	{
    path: 'users',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
		data: {
      breadcrumb: 'Users',
			title: 'Users'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResellersRouting { }