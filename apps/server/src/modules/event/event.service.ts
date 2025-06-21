import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEvent } from "src/common/events/event.event";
import { Repository } from "typeorm";
import { Event } from "../../db/entities/event";
import { SessionService } from "../session/session.service";

@Injectable()
export class EventService {
	private readonly logger = new Logger(EventService.name);
	constructor(
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
		@Inject(SessionService)
		private readonly sessionService: SessionService,
	) {}

	async createEvent(event: EventEvent) {
		this.logger.log(`Creating event for session ${event.sessionId}`);
		const session = await this.sessionService.getSession(event.sessionId);
		if (!session) {
			throw new Error(`Session ${event.sessionId} not found`);
		}
		const newEvent = this.eventRepository.create({
			session,
			type: event.type,
			data: event.data,
		});
		return this.eventRepository.save(newEvent);
	}
}
