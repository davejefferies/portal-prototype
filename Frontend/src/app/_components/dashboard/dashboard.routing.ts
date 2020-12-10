import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: DashboardComponent
  },
	{ 
    path: 'alerts',
    loadChildren: () => import('../messages/messages.module').then(m => m.MessagesModule),
    data: {
      breadcrumb: 'Alerts', 
			title: 'Alerts'
    }
  },
	{ 
    path: 'resellers',
    loadChildren: () => import('../resellers/resellers.module').then(m => m.ResellersModule),
    data: {
      breadcrumb: 'Resellers', 
			title: 'Resellers'
    }
  },
	{ 
    path: 'messages',
    loadChildren: () => import('../messages/messages.module').then(m => m.MessagesModule),
    data: {
      breadcrumb: 'Messages', 
			title: 'Messages'
    }
  },
	{ 
    path: 'clients',
    loadChildren: () => import('../clients/clients.module').then(m => m.ClientsModule),
    data: {
      breadcrumb: 'My Clients',
			title: 'My Clients'
    }
  },
	{ 
    path: 'orders',
    loadChildren: () => import('../orders/orders.module').then(m => m.OrdersModule),
    data: {
      breadcrumb: 'Orders',
			title: 'Orders'
    }
  },
	{ 
    path: 'users',
    loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: 'Users',
			title: 'Users'
    }
  },
	{ 
    path: 'help',
    loadChildren: () => import('../help/help.module').then(m => m.HelpModule),
    data: {
      breadcrumb: 'Help & Support',
			title: 'Help & Support'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRouting { }