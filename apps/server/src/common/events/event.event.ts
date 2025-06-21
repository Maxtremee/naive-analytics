import { EventType } from "../../modules/event/event-type";

export const EVENT_EVENT = "event" as const;

export class EventEvent {
	constructor(
		public readonly sessionId: string,
		public readonly type: EventType,
		public readonly data: Record<string, unknown>,
	) {}
}
