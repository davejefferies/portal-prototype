import { Reseller, Role } from '../_models';

export interface User {
  id: number;
	reseller: Reseller;
	firstName: string;
	lastName: string;
	email: string;
	permissionLevel?: number;
	role: Role;
	username: string;
	password: string;
	hidden: boolean;
	token: string;
}