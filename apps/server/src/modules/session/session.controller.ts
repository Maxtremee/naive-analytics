import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, Post } from "@nestjs/common";
import { Queue } from "bullmq";
import { RealIp } from "nestjs-real-ip";
import { createZodDto } from "nestjs-zod";
import { SessionEvent } from "src/common/events/session.event";
import { QUEUES } from "src/common/queue";
import { z } from "zod";

const upsertSessionSchema = z.object({
	apiKey: z.string(),
	id: z.string(),
	referrer: z.string().optional(),
	userAgent: z.string().optional(),
	enteredAt: z.coerce.date().optional(),
	exitedAt: z.coerce.date().optional(),
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
	async upsertSession(@Body() body: UpsertSessionDto, @RealIp() ip: string) {
		await this.sessionQueue.add(
			QUEUES.SESSION,
			new SessionEvent(
				body.id,
				body.apiKey,
				body.referrer,
				body.userAgent,
				ip,
				body.enteredAt,
				body.exitedAt,
				body.duration,
				body.path,
			),
		);
	}
}
