import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmartTableComponent } from './_components';

@NgModule({
  declarations: [
	  SmartTableComponent
  ],
	entryComponents: [
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
		SmartTableComponent
  ],
  imports: [
    CommonModule,
		FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
	providers: [
  ]
})
export class SharedModule {}