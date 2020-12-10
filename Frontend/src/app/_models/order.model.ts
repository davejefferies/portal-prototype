import { OrderItem } from './order-item.model';
import { OrderHistoryItem } from './order-history-item.model';
import { OrderStatus } from './order-status.model';
import { Client } from './client.model';

export interface Order {
  id: number;
	client: Client;
	created: string;
	notes?: string;
	items: OrderItem[],
	history: OrderHistoryItem[],
	status: OrderStatus
}