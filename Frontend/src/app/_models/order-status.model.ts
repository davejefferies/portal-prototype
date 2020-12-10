export const enum OrderStatus {
  Requested,
	Processing,
	PartialComplete,
	Complete,
	Failed,
	MoreInfo
}

export const OrderStatuses = {
  [OrderStatus.Requested]: 'Requested',
	[OrderStatus.Processing]: 'Processing',
	[OrderStatus.PartialComplete]: 'Partially Completed',
	[OrderStatus.Complete]: 'Completed',
	[OrderStatus.Failed]: 'Failed',
	[OrderStatus.MoreInfo]: 'More Information Required',
}