import { OnWorkerEvent, Processor } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { SESSION_EVENT, SessionEvent } from "src/common/events/session.event";
import { QUEUES } from "src/common/queue";
import { SessionService } from "./session.service";

export type SessionJob = Job<SessionEvent, void, typeof SESSION_EVENT>;

@Processor(QUEUES.SESSION)
export class SessionConsumer {
	private readonly logger = new Logger(SessionConsumer.name);

	constructor(
		@Inject(SessionService) private readonly sessionService: SessionService,
	) {}

	@OnWorkerEvent("active")
	async onActive(job: SessionJob): Promise<void> {
		this.logger.log(`Handling session: ${job.data.id}`);
	}

	@OnWorkerEvent("completed")
	async onCompleted(job: SessionJob): Promise<void> {
		this.logger.log(`Handling session ${job.data.id} completed`);
	}

	@OnWorkerEvent("failed")
	async onFailed(job: SessionJob): Promise<void> {
		this.logger.error(`Handling session ${job.data.id} failed`);
	}

	async process(job: SessionJob): Promise<void> {
		try {
			await this.sessionService.upsertSession(job.data);
		} catch (error) {
			this.logger.error(`Error upserting session ${job.data.id}: ${error}`);
			throw error;
		}
	}
}
