import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { OrdersComponent } from './orders.component';
import { OrderEditorComponent } from '../order-editor/order-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: OrdersComponent
  },
	{
    path: 'new',
    canActivate: [ AuthGuard ],
    component: OrderEditorComponent,
		data: {
      breadcrumb: 'New',
			title: 'New Order'
    }
  },
	{
    path: 'edit/:id',
    canActivate: [ AuthGuard ],
    component: OrderEditorComponent,
		data: {
      breadcrumb: 'Edit',
			title: 'Edit Order'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRouting { }