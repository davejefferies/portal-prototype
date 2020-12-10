import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_guards/auth.guard';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: ContactUsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRouting { }