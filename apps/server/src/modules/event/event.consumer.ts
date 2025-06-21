import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { EVENT_EVENT, EventEvent } from "src/common/events/event.event";
import { QUEUES } from "src/common/queue";
import { EventService } from "./event.service";

export type EventJob = Job<EventEvent, void, typeof EVENT_EVENT>;

@Processor(QUEUES.EVENT)
export class EventConsumer extends WorkerHost {
	private readonly logger = new Logger(EventConsumer.name);

	constructor(
		@Inject(EventService) private readonly eventService: EventService,
	) {
		super();
	}

	@OnWorkerEvent("active")
	async onActive(job: EventJob): Promise<void> {
		this.logger.log(`Handling event: ${job.data.sessionId}`);
	}

	@OnWorkerEvent("completed")
	async onCompleted(job: EventJob): Promise<void> {
		this.logger.log(`Handling event ${job.data.sessionId} completed`);
	}

	@OnWorkerEvent("failed")
	async onFailed(job: EventJob): Promise<void> {
		this.logger.error(`Handling event ${job.data.sessionId} failed`);
	}

	async process(job: EventJob): Promise<void> {
		try {
			await this.eventService.createEvent(job.data);
		} catch (error) {
			this.logger.error(`Error creating event ${job.data.sessionId}: ${error}`);
			throw error;
		}
	}
}
