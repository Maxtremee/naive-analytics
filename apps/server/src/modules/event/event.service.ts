import { Injectable } from "@nestjs/common";
import { EventEvent } from "src/common/events/event.event";
import { Event } from "../../db/entities/event";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>,
	) {}

	async createEvent(event: EventEvent) {
		const newEvent = this.eventRepository.create({
			type: event.type,
			session: {
				id: event.sessionId,
			},
			data: event.data,
		});
		return this.eventRepository.save(newEvent);
	}
}
