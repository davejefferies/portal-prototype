export const enum Status {
  Pending,
	InProgress,
	Live,
	PauseRequest,
	Paused,
	DeactivateRequest,
	Deactivated,
}

export const Statuses = {
  [Status.Pending]: 'Pending',
	[Status.InProgress]: 'In Progress',
	[Status.Live]: 'Live',
	[Status.PauseRequest]: 'Pause Requested',
	[Status.Paused]: 'Paused',
	[Status.DeactivateRequest]: 'Deactivation Requested',
	[Status.Deactivated]: 'Deactivated'
}