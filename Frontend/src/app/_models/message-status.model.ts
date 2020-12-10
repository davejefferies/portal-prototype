export const enum MessageStatus {
  Draft,
	Unread,
	Read,
	Deleted
}

export const MessageStatuses = {
  [MessageStatus.Draft]: 'Draft',
	[MessageStatus.Unread]: 'Unread',
	[MessageStatus.Read]: 'Read',
	[MessageStatus.Deleted]: 'Deleted',
}