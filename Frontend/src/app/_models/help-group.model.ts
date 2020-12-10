export const enum HelpGroup {
	Messages,
  Clients,
	Orders,
	Users,
}

export const HelpGroups = {
  [HelpGroup.Messages]: {
	  key: HelpGroup.Messages,
	  icon: 'fa-commenting-o',
		title: 'Messages / Alerts',
		blurb: 'Get help with the Messages and Alerts.'
	},
	[HelpGroup.Clients]: {
	  key: HelpGroup.Clients,
	  icon: 'fa-users',
		title: 'My Clients',
		blurb: 'Get help with managing your Clients.'
	},
	[HelpGroup.Orders]: {
	  key: HelpGroup.Orders,
	  icon: 'fa-shopping-cart',
		title: 'My Orders',
		blurb: 'Get help with placing orders.'
	},
	[HelpGroup.Users]: {
	  key: HelpGroup.Users,
	  icon: 'fa-user',
		title: 'User Management',
		blurb: 'Get help with managing your users.'
	}
}