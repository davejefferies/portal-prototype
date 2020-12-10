export const enum MessageSeverity {
  None,
  Low,
	Medium,
	High,
	VeryHigh
}

export const MessageSeverities = {
  [MessageSeverity.None]: 'None',
	[MessageSeverity.Low]: 'Low',
	[MessageSeverity.Medium]: 'Medium',
	[MessageSeverity.High]: 'High',
	[MessageSeverity.VeryHigh]: 'Very High',
}