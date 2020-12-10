import { HelpGroup } from '../_models';

export interface Help {
  id: number;
	group: HelpGroup;
	priority: number;
	expanded: boolean;
	question: string;
	answer: string;
	caq: boolean;
	caq_priority: number;
	caq_expanded: boolean;
}