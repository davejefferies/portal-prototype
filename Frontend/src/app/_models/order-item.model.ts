import { OrderType } from './order-type.model';
import { OrderStatus } from './order-status.model';

export interface OrderItem {
  id: number;
	kind: string;
	type: OrderType;
	number: number;
	label: string;
	stamp: string;
	status: OrderStatus;
	notes?: string;
}