import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, Post } from "@nestjs/common";
import { Queue } from "bullmq";
import { createZodDto } from "nestjs-zod";
import { SessionEvent } from "src/common/events/session.event";
import { QUEUES } from "src/common/queue";
import { z } from "zod";

const upsertSessionSchema = z.object({
	apiKey: z.string(),
	userId: z.string(),
	referrer: z.string().optional(),
	userAgent: z.string().optional(),
	ipAddress: z.string().optional(),
	enteredAt: z.date().optional(),
	exitedAt: z.date().optional(),
	duration: z.number().optional(),
	path: z.array(z.string()).optional(),
});

class UpsertSessionDto extends createZodDto(upsertSessionSchema) {}

@Controller("session")
export class SessionController {
	constructor(
		@InjectQueue(QUEUES.SESSION)
		private readonly sessionQueue: Queue,
	) {}

	@Post()
	async upsertSession(@Body() body: UpsertSessionDto) {
		return await this.sessionQueue.add(
			QUEUES.SESSION,
			new SessionEvent(
				body.userId,
				body.apiKey,
				body.referrer,
				body.userAgent,
				body.ipAddress,
				body.enteredAt,
				body.exitedAt,
				body.duration,
				body.path,
			),
		);
	}
}
