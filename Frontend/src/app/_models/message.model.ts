import { Reseller, MessageSeverity, MessageStatus, MessageType } from '../_models';

export interface Message {
  id: number;
	reseller?: any;
	subject: string;
	body: string;
	created: string;
	updated?: string;
	type: MessageType;
	status: MessageStatus;
	severity: MessageSeverity;
	delete?: boolean;
	expanded?: boolean;
}