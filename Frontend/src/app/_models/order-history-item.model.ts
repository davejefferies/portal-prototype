import { OrderItem } from './order-item.model';

export interface OrderHistoryItem {
  id: number;
	order: number;
	item: OrderItem;
	stamp: string;
}