export const SESSION_EVENT = "session" as const;

export class SessionEvent {
	constructor(
		public readonly id: string,
		public readonly apiKey: string,
		public readonly referrer?: string,
		public readonly userAgent?: string,
		public readonly ipAddress?: string,
		public readonly enteredAt?: Date,
		public readonly exitedAt?: Date,
		public readonly duration?: number,
		public readonly path?: string[],
	) {}
}
