import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRouting } from './orders.routing';
import { OrdersComponent } from './orders.component';
import {  OrderEditorComponent } from '../order-editor/order-editor.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    OrdersRouting,
		SharedModule
  ],
  declarations: [
	  OrdersComponent,
		OrderEditorComponent
	]
})
export class OrdersModule { }