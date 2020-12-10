import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent, NotFoundComponent } from './_components';

const routes: Routes = [
  { 
    path: '',
    loadChildren: () => import('./_components/dashboard/dashboard.module').then(m => m.DashboardModule),
    data: {
			title: 'Dashboard',
      breadcrumb: 'Dashboard',
      icon: 'silk-house',
      iconOnly: true
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
