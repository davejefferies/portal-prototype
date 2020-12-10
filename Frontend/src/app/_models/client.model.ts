import { Reseller, Status } from '../_models';

export interface Client {
  id: number;
	reseller: Reseller;
	portal_id?: number;
	name: string;
	contact: string;
	email: string;
	status: Status;
	orders?: number;
}