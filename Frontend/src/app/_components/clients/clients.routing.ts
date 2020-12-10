import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { ClientsComponent } from './clients.component';
import { ClientEditorComponent } from '../client-editor/client-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ClientsComponent
  },
	{
    path: 'new',
    canActivate: [ AuthGuard ],
    component: ClientEditorComponent,
		data: {
      breadcrumb: 'New',
			title: 'New Client'
    }
  },
	{
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: ClientEditorComponent,
		data: {
      breadcrumb: 'Edit',
			title: 'Edit Client'
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRouting { }