import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, Post } from "@nestjs/common";
import { Queue } from "bullmq";
import { createZodDto } from "nestjs-zod";
import { EventEvent } from "src/common/events/event.event";
import { QUEUES } from "src/common/queue";
import { z } from "zod";
import { EventType } from "./event-type";

const createEventSchema = z.object({
	apiKey: z.string(),
	sessionId: z.string(),
	type: z.nativeEnum(EventType),
	data: z.record(z.any()),
});
class CreateEventDto extends createZodDto(createEventSchema) {}

@Controller("event")
export class EventController {
	constructor(@InjectQueue(QUEUES.EVENT) private readonly eventQueue: Queue) {}

	@Post()
	async createEvent(@Body() body: CreateEventDto) {
		await this.eventQueue.add(
			QUEUES.EVENT,
			new EventEvent(body.apiKey, body.sessionId, body.type, body.data),
		);
	}
}
