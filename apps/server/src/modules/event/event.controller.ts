import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { Queue } from "bullmq";
import { createZodDto } from "nestjs-zod";
import { EventEvent } from "src/common/events/event.event";
import { QUEUES } from "src/common/queue";
import { z } from "zod";
import { EventType } from "./event-type";

const createEventSchema = z.object({
	sessionId: z.string(),
	type: z.nativeEnum(EventType),
	data: z.record(z.any()),
});
class CreateEventDto extends createZodDto(createEventSchema) {}

@Controller("event")
export class EventController {
	constructor(@InjectQueue(QUEUES.EVENT) private readonly eventQueue: Queue) {}

	@Post()
	@ApiOkResponse({
		type: CreateEventDto,
	})
	async createEvent(@Body() body: CreateEventDto) {
		return this.eventQueue.add(
			QUEUES.EVENT,
			new EventEvent(body.sessionId, body.type, body.data),
		);
	}
}
