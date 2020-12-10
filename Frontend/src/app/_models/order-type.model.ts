export const enum OrderType {
  Extension,
	Queue,
	IVR,
	Conference
}

export const OrderTypes = {
  [OrderType.Extension]: 'Extension',
	[OrderType.Queue]: 'Queue',
	[OrderType.IVR]: 'IVR',
	[OrderType.Conference]: 'Conference'
}