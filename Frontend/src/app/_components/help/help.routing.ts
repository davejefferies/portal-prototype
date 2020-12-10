import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { HelpComponent } from './help.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: HelpComponent
  },
	{ 
    path: 'contact-us',
    loadChildren: () => import('../contact-us/contact-us.module').then(m => m.ContactUsModule),
    data: {
      breadcrumb: 'Contact Us', 
			title: 'Contact Us'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRouting { }